export enum NotificationTypes {
  success,
  warning,
}

export class NotificationModel {
  constructor(public readonly title: string,
              public readonly description: string,
              public readonly type: NotificationTypes = NotificationTypes.success) {
  }
}
