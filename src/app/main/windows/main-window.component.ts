import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { Observable } from 'rxjs/Observable';
import { NotificationModel } from '../../notifications/models/notification.model';
import { ElectronService } from 'ngx-electron';
import { CommunicationService } from '../../communication/services/communication.service';
import { CommunicationDataModel } from '../../communication/models/communication-data.model';
import 'rxjs/add/observable/fromEvent';

@Component({
  moduleId: module.id.split('\\').join('/'),
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css'],
})
export class MainWindowComponent implements OnInit, OnDestroy {
  notificationWindowClosed$: Observable<null>;

  constructor(private notificationsService: NotificationsService,
              private electronService: ElectronService,
              private communicationService: CommunicationService) {
  }

  ngOnInit() {
    this.electronService.remote.getCurrentWindow()
      .addListener('minimize', this.hideWindow);
    this.notificationWindowClosed$ = this.notificationsService.getNotificationWindowClosed$();
    Observable.fromEvent(this.electronService.remote.getCurrentWindow(), 'show')
      .subscribe(this.focusInput);
  }

  ngOnDestroy(): void {
    this.electronService.remote.getCurrentWindow()
      .removeListener('minimize', this.hideWindow);
  }

  focusInput = () => {

  };

  notify(duration: number) {
    this.notificationsService.sendNotification(
      new NotificationModel('Break reminder', 'It\'s time for a quick break', duration),
    );
  }

  hideWindow = () => {
    this.electronService.remote.getCurrentWindow().hide();
  };

  closeWindow() {
    this.notificationsService.closeWindow();
    this.electronService.remote.getCurrentWindow().close();
  }

  sendTimeStart(minutes: number) {
    this.communicationService.send(new CommunicationDataModel('timer-started', minutes, false));
  }
}
