import { Inject, Injectable } from '@nestjs/common';
import type { UnreadCount } from '@bankbridge/contracts';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../domain/notification-repository.port';

@Injectable()
export class GetUnreadCountUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
  ) {}

  async execute(userId: string): Promise<UnreadCount> {
    const count = await this.notifications.countUnread(userId);
    return { count };
  }
}
