import { Inject, Injectable } from '@nestjs/common';
import type { NotificationPage } from '@bankbridge/contracts';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../domain/notification-repository.port';

export interface ListNotificationsInput {
  page: number;
  pageSize: number;
  unreadOnly?: boolean;
}

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepository,
  ) {}

  async execute(userId: string, input: ListNotificationsInput): Promise<NotificationPage> {
    const { data, total } = await this.notifications.findPageByUser(userId, input);
    return {
      data: data.map((n) => n.toDto()),
      meta: {
        page: input.page,
        pageSize: input.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / input.pageSize)),
      },
    };
  }
}
