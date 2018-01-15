import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { Observable } from 'rxjs/Observable';
import { NotificationModel, NotificationTypes } from '../../notifications/models/notification.model';
import { ElectronService } from 'ngx-electron';

@Component({
  moduleId : module.id.split('\\').join('/'),
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']
})
export class MainWindowComponent implements OnInit {
  notificationClick$: Observable<null>;

  constructor(private notificationsService: NotificationsService, private electronService: ElectronService) { }

  ngOnInit() {
    this.notificationClick$ = this.notificationsService.listenForNotificationsClicked();
  }

  notify() {
    this.notificationsService.sendNotification(
      new NotificationModel('Break reminder', 'It\'s time for a quick break', NotificationTypes.warning)
    );
  }

  hideWindow() {
    this.electronService.remote.getCurrentWindow().hide();
  }

  closeWindow() {
    this.notificationsService.closeWindow();
    this.electronService.remote.getCurrentWindow().close();
  }
}
