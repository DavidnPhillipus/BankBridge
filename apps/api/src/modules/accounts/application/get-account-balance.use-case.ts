import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { AccountBalance } from '@bankbridge/contracts';
import { GatewayService } from '../../api-gateway/application/gateway.service';
import { NotificationService } from '../../notifications/application/notification.service';
import { ConsentAccessService } from '../../consent/application/consent-access.service';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../domain/account-repository.port';

/**
 * Fetches a live balance for one account through the gateway, gated by a
 * BALANCES_READ consent for that account's bank, then refreshes the stored
 * balance. Falls back to the persisted balance if the bank returns nothing.
 */
@Injectable()
export class GetAccountBalanceUseCase {
  constructor(
    private readonly consentAccess: ConsentAccessService,
    private readonly gateway: GatewayService,
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
    private readonly notifications: NotificationService,
  ) {}

  async execute(
    userId: string,
    accountId: string,
    applicationId?: string,
  ): Promise<AccountBalance> {
    const account = await this.accounts.findByIdForUser(userId, accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const bank = await this.consentAccess.assertBankScope(
      userId,
      account.bankId,
      'BALANCES_READ',
      applicationId,
    );

    const ctx = { customerRef: userId };
    const balance = await this.gateway.getBalance(
      bank.adapterKey,
      ctx,
      account.externalId,
    );

    if (balance) {
      const updated = await this.accounts.updateBalance(
        account.id,
        balance.current,
        balance.available,
      );
      await this.notifications.checkLowBalance(
        userId,
        `${updated.toDto().bankName} ${updated.toDto().name}`,
        balance.available,
      );
      return {
        accountId: updated.id,
        currency: updated.currency,
        balance: balance.current,
        availableBalance: balance.available,
      };
    }

    const dto = account.toDto();
    await this.notifications.checkLowBalance(
      userId,
      `${dto.bankName} ${dto.name}`,
      dto.availableBalance,
    );
    return {
      accountId: dto.id,
      currency: dto.currency,
      balance: dto.balance,
      availableBalance: dto.availableBalance,
    };
  }
}
