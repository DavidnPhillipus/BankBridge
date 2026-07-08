import { Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../domain/notification-repository.port';

@Injectable()
export class MarkAllNotificationsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
  ) {}

  async execute(userId: string): Promise<{ marked: number }> {
    const marked = await this.notifications.markAllRead(userId);
    return { marked };
  }
}
