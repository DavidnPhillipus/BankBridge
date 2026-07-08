import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BANK_NORMALIZERS,
  type BankNormalizer,
} from '../domain/bank-normalizer.port';

/**
 * Resolves the correct normalizer for a bank by adapterKey. Mirrors the adapter
 * registry so, for each bank, adapter (fetch raw) and normalizer (map to
 * canonical) are looked up the same way.
 */
@Injectable()
export class NormalizerRegistry {
  private readonly normalizers: Map<string, BankNormalizer>;

  constructor(@Inject(BANK_NORMALIZERS) normalizers: BankNormalizer[]) {
    this.normalizers = new Map(normalizers.map((n) => [n.adapterKey, n]));
  }

  get(adapterKey: string): BankNormalizer {
    const normalizer = this.normalizers.get(adapterKey);
    if (!normalizer) {
      throw new NotFoundException(
        `No normalizer registered for bank "${adapterKey}"`,
      );
    }
    return normalizer;
  }
}
