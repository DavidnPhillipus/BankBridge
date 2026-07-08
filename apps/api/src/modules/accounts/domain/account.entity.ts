import type { Account as AccountDto, AccountType } from '@bankbridge/contracts';

export interface AccountProps {
  id: string;
  userId: string;
  bankId: string;
  bankName: string;
  externalId: string;
  name: string;
  accountType: AccountType;
  mask: string | null;
  currency: string;
  balance: number;
  availableBalance: number;
}

/** A customer's account at a bank, as persisted in the platform's canonical shape. */
export class Account {
  constructor(private readonly props: AccountProps) {}

  get id(): string {
    return this.props.id;
  }
  get bankId(): string {
    return this.props.bankId;
  }
  get externalId(): string {
    return this.props.externalId;
  }
  get currency(): string {
    return this.props.currency;
  }

  toDto(): AccountDto {
    return {
      id: this.props.id,
      bankId: this.props.bankId,
      bankName: this.props.bankName,
      name: this.props.name,
      accountType: this.props.accountType,
      mask: this.props.mask,
      currency: this.props.currency,
      balance: this.props.balance,
      availableBalance: this.props.availableBalance,
    };
  }
}
