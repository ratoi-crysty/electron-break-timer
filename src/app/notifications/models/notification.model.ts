export enum NotificationTypes {
  success,
  info,
  warning,
}

export class NotificationModel {
  constructor(public readonly title: string,
              public readonly description: string,
              public readonly duration: number = 0.1,
              public readonly type: NotificationTypes = NotificationTypes.info) {
  }
}
