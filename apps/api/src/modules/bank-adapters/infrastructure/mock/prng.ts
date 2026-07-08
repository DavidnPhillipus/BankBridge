/**
 * Tiny deterministic PRNG utilities. Given the same seed string, the same
 * sequence of numbers is produced — so mock bank data is stable across calls
 * (a real requirement: an account's balance shouldn't change every request).
 */

/** xfnv1a string hash -> 32-bit seed. */
export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** mulberry32 PRNG. Returns a function yielding floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic RNG helper bundle built from a seed string. */
export class SeededRandom {
  private readonly next: () => number;

  constructor(seed: string) {
    this.next = mulberry32(hashSeed(seed));
  }

  /** Float in [min, max). */
  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }

  /** Money value rounded to 2 decimals in [min, max). */
  money(min: number, max: number): number {
    return Math.round(this.float(min, max) * 100) / 100;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)];
  }

  bool(probabilityTrue = 0.5): boolean {
    return this.next() < probabilityTrue;
  }
}
