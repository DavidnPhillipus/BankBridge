import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BANK_ADAPTERS,
  type BankAdapterPort,
} from '../domain/bank-adapter.port';

/**
 * Resolves a BankAdapterPort by its adapterKey (which matches Bank.adapterKey
 * in the database). This is the indirection that lets the API Gateway work with
 * any bank without knowing which concrete adapter it's talking to — and lets us
 * add/replace banks by registering a provider, with zero changes to callers.
 */
@Injectable()
export class BankAdapterRegistry {
  private readonly adapters: Map<string, BankAdapterPort>;

  constructor(@Inject(BANK_ADAPTERS) adapters: BankAdapterPort[]) {
    this.adapters = new Map(adapters.map((a) => [a.adapterKey, a]));
  }

  /** Returns the adapter for a key, or throws if none is registered. */
  get(adapterKey: string): BankAdapterPort {
    const adapter = this.adapters.get(adapterKey);
    if (!adapter) {
      throw new NotFoundException(`No bank adapter registered for "${adapterKey}"`);
    }
    return adapter;
  }

  has(adapterKey: string): boolean {
    return this.adapters.has(adapterKey);
  }

  /** All registered adapter keys (useful for health checks / diagnostics). */
  keys(): string[] {
    return [...this.adapters.keys()];
  }
}
