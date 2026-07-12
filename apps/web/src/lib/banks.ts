/** Bank slugs match filenames in `apps/web/public/banks/`. */
export const SUPPORTED_BANKS = [
  {
    name: 'Bank Windhoek',
    slug: 'bank-windhoek',
    logoUrl: '/banks/bank-windhoek.png',
    primaryColor: '#0033A0',
  },
  {
    name: 'Bank of Namibia',
    slug: 'bank-of-namibia',
    logoUrl: '/banks/bank-of-namibia.png',
    primaryColor: '#1D4E89',
  },
  {
    name: 'FNB Namibia',
    slug: 'fnb-namibia',
    logoUrl: '/banks/fnb-namibia.png',
    primaryColor: '#008752',
  },
  {
    name: 'NamPost',
    slug: 'nampost',
    logoUrl: '/banks/nampost.jpg',
    primaryColor: '#E4002B',
  },
  {
    name: 'Standard Bank Namibia',
    slug: 'standard-bank-namibia',
    logoUrl: '/banks/standard-bank-namibia.png',
    primaryColor: '#0033A1',
  },
  {
    name: 'Nedbank Namibia',
    slug: 'nedbank-namibia',
    logoUrl: '/banks/nedbank-namibia.png',
    primaryColor: '#006A4D',
  },
] as const;

export type BankSlug = (typeof SUPPORTED_BANKS)[number]['slug'];

export function bankLogoUrlBySlug(slug: string): string | undefined {
  return SUPPORTED_BANKS.find((b) => b.slug === slug)?.logoUrl;
}

export function bankLogoUrlByName(name: string): string | undefined {
  return SUPPORTED_BANKS.find((b) => b.name === name)?.logoUrl;
}
