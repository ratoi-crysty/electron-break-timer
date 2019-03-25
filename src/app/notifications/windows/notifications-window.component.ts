import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { NotificationModel, NotificationTypes } from '../models/notification.model';
import { Toast, ToastsManager } from 'ng2-toastr';
import * as electron from 'electron';
import { ElectronService } from 'ngx-electron';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
  moduleId: module.id.split('\\').join('/'),
  selector: 'app-notifications-window',
  templateUrl: './notifications-window.component.html',
  styleUrls: ['./notifications-window.component.css']
})
export class NotificationsWindowComponent implements OnInit, OnDestroy {
  private notificationSubscription: Subscription;

  private static formatDateNumber(number: number): string {
    return `${number < 10 ? '0' : ''}${number}`;
  }

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
          electron.remote.getCurrentWindow().hide();
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

  warningTimer(duration: number): Observable<Toast> {
    const until = moment().add(duration * 60, 'seconds');

    return Observable.fromPromise(this.toastr
      .warning('You should be on break right now', 'Break time', { dismiss: 'controlled' }))
      .switchMap((toast) => Observable.timer(0, 100).map(() => toast))
      .do((toast) => {
        const diff = until.diff(moment(), 'seconds') + 1;
        toast.message = 'You should be on break right now. '
          + `The break will end in ${NotificationsWindowComponent.formatDateNumber(Math.trunc(diff / 60))}`
          + `:${NotificationsWindowComponent.formatDateNumber(diff % 60)}`;
      })
      .filter(() => until.diff(moment(), 'seconds') < 0)
      .do((toast) => this.toastr.dismissToast(toast))
      .take(1);
  }

  private openToast(notification: NotificationModel): Observable<Toast> {
    let toastMethod: (message: string, title?: string, options?: any) => Promise<Toast>;

    if (notification.type === NotificationTypes.warning) {
      toastMethod = this.toastr.warning.bind(this.toastr);
    } else if (notification.type === NotificationTypes.success) {
      toastMethod = this.toastr.success.bind(this.toastr);
    } else {
      toastMethod = this.toastr.info.bind(this.toastr);
    }

    electron.remote.getCurrentWindow().show();

    return Observable.fromPromise(toastMethod(notification.description, notification.title, { dismiss: 'click' }))
      .combineLatest(this.toastr.onClickToast().first())
      .delay(500)
      .switchMap(() => this.warningTimer(notification.duration));
  }
}
