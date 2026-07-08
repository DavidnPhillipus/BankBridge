import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Account as AccountDto } from '@bankbridge/contracts';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../domain/account-repository.port';

@Injectable()
export class GetAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
  ) {}

  async execute(userId: string, accountId: string): Promise<AccountDto> {
    const account = await this.accounts.findByIdForUser(userId, accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account.toDto();
  }
}
