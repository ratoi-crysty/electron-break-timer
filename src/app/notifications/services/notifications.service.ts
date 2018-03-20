import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';

import { Injectable } from '@angular/core';
import { CommunicationService } from '../../communication/services/communication.service';
import { NotificationModel } from '../models/notification.model';
import { Observable } from 'rxjs/Observable';
import { CommunicationDataModel } from '../../communication/models/communication-data.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NotificationsService {
  private static channelNameNotification = 'notifications';
  private static channelNameNotificationClicked = 'notifications-clicked';
  private static channelNameCloseNotifications = 'notifications-close-notifications';
  private static channelNameCloseWindow = 'notifications-close-window';

  private notification$: Observable<NotificationModel>;
  private notificationWindowClosed$: Observable<null>;
  private notificationsOpenStatus$: BehaviorSubject<boolean>;
  private windowsOpenStatus$: BehaviorSubject<boolean>;

  constructor(private communicationService: CommunicationService) {
  }

  sendNotification(notification: NotificationModel) {
    this.communicationService
      .send(new CommunicationDataModel(NotificationsService.channelNameNotification, notification));
  }

  getNotification$() {
    if (!this.notification$) {
      this.notification$ = this.communicationService.listenToChannel(NotificationsService.channelNameNotification)
        .share();
    }

    return this.notification$;
  }

  notificationWindowClosed() {
    this.communicationService
      .send(new CommunicationDataModel(NotificationsService.channelNameNotificationClicked, null));
  }

  getNotificationWindowClosed$() {
    if (!this.notificationWindowClosed$) {
      this.notificationWindowClosed$ = this.communicationService
        .listenToChannel(NotificationsService.channelNameNotificationClicked)
        .share();
    }

    return this.notificationWindowClosed$;
  }

  closeAllNotifications() {
    this.communicationService.send(new CommunicationDataModel(NotificationsService.channelNameCloseNotifications, null));
  }

  getNotificationsOpenStatus$(): BehaviorSubject<boolean> {
    if (!this.notificationsOpenStatus$) {
      this.notificationsOpenStatus$ = new BehaviorSubject<boolean>(false);
      this.communicationService.listenToChannel(NotificationsService.channelNameNotificationClicked)
        .subscribe(this.notificationsOpenStatus$);
    }

    return this.notificationsOpenStatus$;
  }

  closeWindow() {
    this.communicationService.send(new CommunicationDataModel(NotificationsService.channelNameCloseWindow, null));
  }

  getWindowsOpenStatus$(): BehaviorSubject<boolean> {
    if (!this.windowsOpenStatus$) {
      this.windowsOpenStatus$ = new BehaviorSubject<boolean>(false);
      this.communicationService.listenToChannel(NotificationsService.channelNameCloseWindow)
        .subscribe(this.notificationsOpenStatus$);
    }

    return this.windowsOpenStatus$;
  }
}
