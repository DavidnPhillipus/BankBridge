import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../../shared/redis/redis.service';
import { BankAdapterRegistry } from '../../bank-adapters/application/bank-adapter-registry.service';
import type {
  AdapterContext,
  TransactionQueryOptions,
} from '../../bank-adapters/domain/bank-adapter.port';
import type {
  NormalizedAccount,
  NormalizedBalance,
  NormalizedIdentity,
  NormalizedTransaction,
} from '../domain/normalized-models';
import { NormalizerRegistry } from './normalizer-registry.service';

export interface BankSource {
  adapterKey: string;
  ctx: AdapterContext;
}

export interface AggregatedAccounts {
  adapterKey: string;
  accounts: NormalizedAccount[];
}

/**
 * The API Gateway. It is the single choke point through which all bank data
 * flows: resolve the adapter (fetch raw dialect) -> resolve the normalizer
 * (map to canonical) -> cache. Callers (accounts/transactions modules) receive
 * ONE standard format regardless of which bank served the data.
 */
@Injectable()
export class GatewayService {
  private readonly cacheTtl: number;

  constructor(
    private readonly adapters: BankAdapterRegistry,
    private readonly normalizers: NormalizerRegistry,
    private readonly cache: RedisService,
    config: ConfigService,
  ) {
    this.cacheTtl = Number(config.get('GATEWAY_CACHE_TTL') ?? 60);
  }

  async getAccounts(
    adapterKey: string,
    ctx: AdapterContext,
  ): Promise<NormalizedAccount[]> {
    const key = this.cacheKey(adapterKey, ctx, 'accounts');
    const cached = await this.cache.getJson<NormalizedAccount[]>(key);
    if (cached) return cached;

    const raw = await this.adapters.get(adapterKey).getAccounts(ctx);
    const accounts = this.normalizers.get(adapterKey).normalizeAccounts(raw);
    await this.cache.setJson(key, accounts, this.cacheTtl);
    return accounts;
  }

  async getBalance(
    adapterKey: string,
    ctx: AdapterContext,
    accountExternalId: string,
  ): Promise<NormalizedBalance | null> {
    const key = this.cacheKey(adapterKey, ctx, `balance:${accountExternalId}`);
    const cached = await this.cache.getJson<NormalizedBalance>(key);
    if (cached) return cached;

    const raw = await this.adapters
      .get(adapterKey)
      .getBalances(ctx, accountExternalId);
    const balance = this.normalizers.get(adapterKey).normalizeBalance(raw);
    if (balance) await this.cache.setJson(key, balance, this.cacheTtl);
    return balance;
  }

  async getTransactions(
    adapterKey: string,
    ctx: AdapterContext,
    accountExternalId: string,
    options?: TransactionQueryOptions,
  ): Promise<NormalizedTransaction[]> {
    const suffix = `txns:${accountExternalId}:${options?.limit ?? 'all'}:${
      options?.since?.toISOString() ?? 'any'
    }`;
    const key = this.cacheKey(adapterKey, ctx, suffix);
    const cached = await this.cache.getJson<NormalizedTransaction[]>(key);
    if (cached) return cached.map(this.reviveTransaction);

    const raw = await this.adapters
      .get(adapterKey)
      .getTransactions(ctx, accountExternalId, options);
    const txns = this.normalizers.get(adapterKey).normalizeTransactions(raw);
    await this.cache.setJson(key, txns, this.cacheTtl);
    return txns;
  }

  async getIdentity(
    adapterKey: string,
    ctx: AdapterContext,
  ): Promise<NormalizedIdentity | null> {
    const raw = await this.adapters.get(adapterKey).getIdentity(ctx);
    return this.normalizers.get(adapterKey).normalizeIdentity(raw);
  }

  /** Fans out across several banks and returns normalized accounts per bank. */
  async getAggregatedAccounts(sources: BankSource[]): Promise<AggregatedAccounts[]> {
    return Promise.all(
      sources.map(async (s) => ({
        adapterKey: s.adapterKey,
        accounts: await this.getAccounts(s.adapterKey, s.ctx),
      })),
    );
  }

  /** Invalidates all cached data for a customer at a bank. */
  async invalidate(adapterKey: string, ctx: AdapterContext): Promise<void> {
    await this.cache.delByPattern(`gw:${adapterKey}:${ctx.customerRef}:*`);
  }

  private cacheKey(adapterKey: string, ctx: AdapterContext, suffix: string): string {
    return `gw:${adapterKey}:${ctx.customerRef}:${suffix}`;
  }

  // JSON loses the Date type; restore it on cache reads.
  private reviveTransaction(t: NormalizedTransaction): NormalizedTransaction {
    return { ...t, bookedAt: new Date(t.bookedAt) };
  }
}
