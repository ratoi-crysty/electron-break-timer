import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { NotificationModel, NotificationTypes } from '../models/notification.model';
import { Toast, ToastsManager } from 'ng2-toastr';
import * as electron from 'electron';
import { ElectronService } from 'ngx-electron';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId : module.id.split('\\').join('/'),
  selector: 'app-notifications-window',
  templateUrl: './notifications-window.component.html',
  styleUrls: ['./notifications-window.component.css']
})
export class NotificationsWindowComponent implements OnInit, OnDestroy {
  notifications: NotificationModel[] = [];
  private notificationSubscription: Subscription;

  constructor(
    private notificationsService: NotificationsService,
    private electronService: ElectronService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.notificationSubscription = this.notificationsService.listenForNotifications()
      .subscribe(
        (notification: NotificationModel) => {
          let toastMethod: (message: string, title?: string, options?: any) => Promise<Toast>;

          if (notification.type === NotificationTypes.warning) {
            toastMethod = this.toastr.warning.bind(this.toastr);
          } else if (notification.type === NotificationTypes.success) {
            toastMethod = this.toastr.success.bind(this.toastr);
          } else {
            toastMethod = this.toastr.info.bind(this.toastr);
          }

          electron.remote.getCurrentWindow().show();
          toastMethod(notification.description, notification.title, { dismiss: 'click' });
        }
      );
    this.toastr.onClickToast()
      .subscribe(() => {
        electron.remote.getCurrentWindow().hide();
        this.notificationsService.notificationClicked();
      });

    this.notificationsService.listenForCloseWindow()
      .subscribe(
        () => this.electronService.remote.getCurrentWindow().close()
      );
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }
}
