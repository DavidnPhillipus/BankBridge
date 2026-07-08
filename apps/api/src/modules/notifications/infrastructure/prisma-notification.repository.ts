import { Injectable } from '@nestjs/common';
import { type NotificationType as PrismaNotificationType } from '@prisma/client';
import type { NotificationType } from '@bankbridge/contracts';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { Notification } from '../domain/notification.entity';
import type {
  CreateNotificationData,
  NotificationPageQuery,
  NotificationPageResult,
  NotificationRepository,
} from '../domain/notification-repository.port';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificationData): Promise<Notification> {
    const record = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as PrismaNotificationType,
        title: data.title,
        message: data.message,
      },
    });
    return this.toDomain(record);
  }

  async findPageByUser(
    userId: string,
    query: NotificationPageQuery,
  ): Promise<NotificationPageResult> {
    const where = {
      userId,
      ...(query.unreadOnly ? { isRead: false } : {}),
    };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { data: records.map((r) => this.toDomain(r)), total };
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markRead(userId: string, id: string): Promise<boolean> {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    return result.count > 0;
  }

  async markAllRead(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return result.count;
  }

  private toDomain(record: {
    id: string;
    userId: string;
    type: PrismaNotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }): Notification {
    return new Notification({
      id: record.id,
      userId: record.userId,
      type: record.type as NotificationType,
      title: record.title,
      message: record.message,
      isRead: record.isRead,
      createdAt: record.createdAt,
    });
  }
}
