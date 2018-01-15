import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NotificationsService } from '../services/notifications.service';
import { NotificationModel } from '../models/notification.model';
import { ToastsManager } from 'ng2-toastr';
import * as electron from 'electron';

@Component({
  moduleId : module.id.split('\\').join('/'),
  selector: 'app-notifications-window',
  templateUrl: './notifications-window.component.html',
  styleUrls: ['./notifications-window.component.css']
})
export class NotificationsWindowComponent implements OnInit {
  private notificationSubscription: Subscription;
  notifications: NotificationModel[] = [];

  constructor(private notificationsService: NotificationsService, private toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.notificationSubscription = this.notificationsService.listenForNotifications()
      .subscribe(
        (notification: NotificationModel) => {
          electron.remote.getCurrentWindow().show();
          this.toastr.success(notification.title, notification.description, { dismiss: 'click' });
        }
      );
    this.toastr.onClickToast()
      .subscribe(() => {
        electron.remote.getCurrentWindow().hide();
        this.notificationsService.notificationClicked();
      });
  }

}
