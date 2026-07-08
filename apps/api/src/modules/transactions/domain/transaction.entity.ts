import type {
  Category,
  Merchant,
  Transaction as TransactionDto,
  TransactionStatus,
  TransactionType,
} from '@bankbridge/contracts';

export interface TransactionProps {
  id: string;
  accountId: string;
  externalId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  merchant: Merchant | null;
  category: Category | null;
  bookedAt: Date;
}

/** A normalized, persisted transaction with resolved merchant + category. */
export class Transaction {
  constructor(private readonly props: TransactionProps) {}

  get id(): string {
    return this.props.id;
  }

  toDto(): TransactionDto {
    return {
      id: this.props.id,
      accountId: this.props.accountId,
      amount: this.props.amount,
      currency: this.props.currency,
      type: this.props.type,
      status: this.props.status,
      description: this.props.description,
      merchant: this.props.merchant,
      category: this.props.category,
      bookedAt: this.props.bookedAt.toISOString(),
    };
  }
}
