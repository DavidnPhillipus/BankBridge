import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Account as AccountDto } from '@bankbridge/contracts';
import { ConsentAccessService } from '../../consent/application/consent-access.service';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../domain/account-repository.port';

@Injectable()
export class GetAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
    private readonly consentAccess: ConsentAccessService,
  ) {}

  async execute(
    userId: string,
    accountId: string,
    applicationId?: string,
  ): Promise<AccountDto> {
    const account = await this.accounts.findByIdForUser(userId, accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (applicationId) {
      await this.consentAccess.assertBankScope(
        userId,
        account.bankId,
        'ACCOUNTS_READ',
        applicationId,
      );
    }

    return account.toDto();
  }
}
