import type { Notification as NotificationDto, NotificationType } from '@bankbridge/contracts';

export interface NotificationProps {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export class Notification {
  constructor(private readonly props: NotificationProps) {}

  get id(): string {
    return this.props.id;
  }

  toDto(): NotificationDto {
    return {
      id: this.props.id,
      type: this.props.type,
      title: this.props.title,
      message: this.props.message,
      isRead: this.props.isRead,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
