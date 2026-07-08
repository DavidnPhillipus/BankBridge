import { Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../domain/notification-repository.port';

const LOW_BALANCE_THRESHOLD_NAD = 500;

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
  ) {}

  async notifyConsentGranted(
    userId: string,
    applicationName: string,
    bankName: string,
  ): Promise<void> {
    await this.notifications.create({
      userId,
      type: 'CONSENT',
      title: 'Bank access granted',
      message: `${applicationName} can now access your ${bankName} accounts.`,
    });
  }

  async notifyConsentRevoked(
    userId: string,
    applicationName: string,
    bankName: string,
  ): Promise<void> {
    await this.notifications.create({
      userId,
      type: 'CONSENT',
      title: 'Bank access revoked',
      message: `${applicationName} no longer has access to your ${bankName} accounts.`,
    });
  }

  /** Creates a LOW_BALANCE alert when available balance drops below threshold. */
  async checkLowBalance(
    userId: string,
    accountName: string,
    availableBalance: number,
    threshold = LOW_BALANCE_THRESHOLD_NAD,
  ): Promise<void> {
    if (availableBalance >= threshold) return;

    await this.notifications.create({
      userId,
      type: 'LOW_BALANCE',
      title: 'Low balance alert',
      message: `Your ${accountName} account has N$${availableBalance.toFixed(2)} available.`,
    });
  }

  async notifyInsight(userId: string, title: string, message: string): Promise<void> {
    await this.notifications.create({
      userId,
      type: 'INSIGHT',
      title,
      message,
    });
  }
}
