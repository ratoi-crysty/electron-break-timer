import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MainWindowComponent } from './windows/main-window.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { TimerComponent } from './components/timer/timer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NotificationsModule,
  ],
  declarations: [ MainWindowComponent, TimerComponent ],
  bootstrap: [ MainWindowComponent ]
})
export class MainModule {
}
