import { Injectable } from '@angular/core';
import { CommunicationService } from '../../communication/services/communication.service';
import { NotificationModel } from '../models/notification.model';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import { CommunicationDataModel } from '../../communication/models/communication-data.model';

@Injectable()
export class NotificationsService {
  private static channelNameNotification = 'notifications';
  private static channelNameNotificationClicked = 'notifications-clicked';
  private static channelNameCloseNotifications = 'notifications-close-notifications';
  private static channelNameCloseWindow = 'notifications-close-window';

  constructor(private communicationService: CommunicationService) {
  }

  sendNotification(notification: NotificationModel) {
    this.communicationService
      .send(new CommunicationDataModel(NotificationsService.channelNameNotification, notification));
  }

  listenForNotifications(): Observable<NotificationModel> {
    return this.communicationService.listenToChannel(NotificationsService.channelNameNotification);
  }

  notificationClicked() {
    this.communicationService
      .send(new CommunicationDataModel(NotificationsService.channelNameNotificationClicked, null));
  }

  listenForNotificationsClicked(): Observable<null> {
    return this.communicationService.listenToChannel(NotificationsService.channelNameNotificationClicked);
  }

  closeAllNotifications() {
    this.communicationService.send(new CommunicationDataModel(NotificationsService.channelNameCloseNotifications, null));
  }

  listenForCloseAllNotifications() {
    return this.communicationService.listenToChannel(NotificationsService.channelNameCloseNotifications);
  }

  closeWindow() {
    this.communicationService.send(new CommunicationDataModel(NotificationsService.channelNameCloseWindow, null));
  }

  listenForCloseWindow() {
    return this.communicationService.listenToChannel(NotificationsService.channelNameCloseWindow);
  }
}
