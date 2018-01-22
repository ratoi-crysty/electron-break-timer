export enum NotificationTypes {
  success,
  info,
  warning,
}

export class NotificationModel {
  constructor(public readonly title: string,
              public readonly description: string,
              public readonly type: NotificationTypes = NotificationTypes.info) {
  }
}
