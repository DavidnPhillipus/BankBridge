import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { NotificationPage, UnreadCount } from '@bankbridge/contracts';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../auth/interface/decorators/roles.decorator';
import { GetUnreadCountUseCase } from '../application/get-unread-count.use-case';
import { ListNotificationsUseCase } from '../application/list-notifications.use-case';
import { MarkAllNotificationsReadUseCase } from '../application/mark-all-notifications-read.use-case';
import { MarkNotificationReadUseCase } from '../application/mark-notification-read.use-case';
import { NotificationQueryDto } from './dto/notification-query.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Roles('CUSTOMER')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(
    private readonly listNotifications: ListNotificationsUseCase,
    private readonly getUnreadCount: GetUnreadCountUseCase,
    private readonly markRead: MarkNotificationReadUseCase,
    private readonly markAllRead: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for the current user' })
  list(
    @CurrentUser('id') userId: string,
    @Query() query: NotificationQueryDto,
  ): Promise<NotificationPage> {
    return this.listNotifications.execute(userId, {
      page: query.page,
      pageSize: query.pageSize,
      unreadOnly: query.unreadOnly,
    });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Count unread notifications' })
  unread(@CurrentUser('id') userId: string): Promise<UnreadCount> {
    return this.getUnreadCount.execute(userId);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark one notification as read' })
  async markOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.markRead.execute(userId, id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  readAll(@CurrentUser('id') userId: string): Promise<{ marked: number }> {
    return this.markAllRead.execute(userId);
  }
}
