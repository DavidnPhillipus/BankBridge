import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../domain/notification-repository.port';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
  ) {}

  async execute(userId: string, id: string): Promise<void> {
    const updated = await this.notifications.markRead(userId, id);
    if (!updated) {
      throw new NotFoundException('Notification not found');
    }
  }
}
