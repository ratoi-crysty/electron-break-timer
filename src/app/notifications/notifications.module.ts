import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommunicationModule } from '../communication/communication.module';
import { NotificationsWindowComponent } from './windows/notifications-window.component';
import { NotificationsService } from './services/notifications.service';
import { ToastModule } from 'ng2-toastr';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommunicationModule,
    ToastModule.forRoot()
  ],
  providers: [ NotificationsService ],
  declarations: [ NotificationsWindowComponent ],
  bootstrap: [ NotificationsWindowComponent ],
})
export class NotificationsModule {
}
