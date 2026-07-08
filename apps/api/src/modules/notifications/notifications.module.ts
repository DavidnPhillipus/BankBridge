import { Module } from '@nestjs/common';
import { GetUnreadCountUseCase } from './application/get-unread-count.use-case';
import { ListNotificationsUseCase } from './application/list-notifications.use-case';
import { MarkAllNotificationsReadUseCase } from './application/mark-all-notifications-read.use-case';
import { MarkNotificationReadUseCase } from './application/mark-notification-read.use-case';
import { NotificationService } from './application/notification.service';
import { NOTIFICATION_REPOSITORY } from './domain/notification-repository.port';
import { PrismaNotificationRepository } from './infrastructure/prisma-notification.repository';
import { NotificationsController } from './interface/notifications.controller';

/**
 * Notifications: in-app alerts (consent changes, low balance, insights).
 * NotificationService is exported for other modules to emit events.
 */
@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    ListNotificationsUseCase,
    GetUnreadCountUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    { provide: NOTIFICATION_REPOSITORY, useClass: PrismaNotificationRepository },
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
