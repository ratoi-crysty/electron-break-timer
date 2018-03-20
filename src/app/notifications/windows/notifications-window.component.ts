import 'rxjs/add/observable/of';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/first';

import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { NotificationModel, NotificationTypes } from '../models/notification.model';
import { Toast, ToastsManager } from 'ng2-toastr';
import * as electron from 'electron';
import { ElectronService } from 'ngx-electron';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id.split('\\').join('/'),
  selector: 'app-notifications-window',
  templateUrl: './notifications-window.component.html',
  styleUrls: ['./notifications-window.component.css']
})
export class NotificationsWindowComponent implements OnInit, OnDestroy {
  private notificationSubscription: Subscription;

  constructor(private notificationsService: NotificationsService,
              private electronService: ElectronService,
              private toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.notificationSubscription = this.notificationsService.getNotification$()
      .switchMap((notification) => this.openToast(notification))
      .subscribe(
        () => {
          // electron.remote.getCurrentWindow().hide();
          this.notificationsService.notificationWindowClosed();
        }
      );
    this.notificationsService.getWindowsOpenStatus$()
      .subscribe(
        (status) => false && !status && this.electronService.remote.getCurrentWindow().close()
      );
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }

  private openToast(notification: NotificationModel): Observable<void> {
    let toastMethod: (message: string, title?: string, options?: any) => Promise<Toast>;

    if (notification.type === NotificationTypes.warning) {
      toastMethod = this.toastr.warning.bind(this.toastr);
    } else if (notification.type === NotificationTypes.success) {
      toastMethod = this.toastr.success.bind(this.toastr);
    } else {
      toastMethod = this.toastr.info.bind(this.toastr);
    }

    electron.remote.getCurrentWindow().show();

    return Observable.of(toastMethod(notification.description, notification.title, { dismiss: 'click' }))
      .combineLatest(this.toastr.onClickToast().first())
      .delay(500)
      .do(() => {
        this.toastr
          .warning('You should be on break right now', 'Break time', { dismiss: 'controlled' });
      })
      .delay(notification.duration * 60000)
      .do(([toast]: [Toast]) => this.toastr.dismissToast(toast));
  }
}
