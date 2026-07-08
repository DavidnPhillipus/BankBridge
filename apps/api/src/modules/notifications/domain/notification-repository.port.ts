import type { NotificationType } from '@bankbridge/contracts';
import type { Notification } from './notification.entity';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export interface NotificationPageQuery {
  page: number;
  pageSize: number;
  unreadOnly?: boolean;
}

export interface NotificationPageResult {
  data: Notification[];
  total: number;
}

export interface NotificationRepository {
  create(data: CreateNotificationData): Promise<Notification>;
  findPageByUser(userId: string, query: NotificationPageQuery): Promise<NotificationPageResult>;
  countUnread(userId: string): Promise<number>;
  markRead(userId: string, id: string): Promise<boolean>;
  markAllRead(userId: string): Promise<number>;
}
