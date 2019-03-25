import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { MatButton } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId : module.id.split('\\').join('/'),
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Output() showNotification = new EventEmitter<number>();
  @Output() hideWindow = new EventEmitter<void>();
  @Output() timeStart = new EventEmitter<number>();
  @Input() restart$: Observable<null>;
  @ViewChild('hideButton') hideButton: MatButton;
  @ViewChild('input') input: ElementRef;

  secondsLeft: number;
  interval: number | null;
  minutes = 60;
  duration = 5;
  minutesLeft: number;
  nextNotification: Moment;
  restartSubscription: Subscription;
  displayingNotification = false;

  constructor() { }

  ngOnInit() {
    this.restart$
      .subscribe(
        () => this.start(),
      );
  }

  ngOnDestroy() {
    this.restartSubscription.unsubscribe();
  }

  start() {
    if (!this.minutes) {
      return;
    }

    this.displayingNotification = false;

    this.nextNotification = moment().add(this.minutes, 'minutes');

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.tick();
    this.interval = +setInterval(this.tick.bind(this), 1000);
    this.timeStart.emit(this.minutes);
    setTimeout(() => {
      this.hideButton.focus();
    });
  }

  stop() {
    if (!this.interval) {
      return;
    }
    clearInterval(this.interval);
    this.interval = null;
    setTimeout(() => {
      this.input.nativeElement.focus();
    });
  }

  hide() {
    this.hideWindow.emit();
  }

  private tick() {
    this.minutesLeft = this.nextNotification.diff(moment(), 'minutes');
    this.secondsLeft = this.nextNotification.diff(moment(), 'seconds');

    if (this.secondsLeft <= 0) {
      this.minutesLeft = this.nextNotification.diff(moment(), 'minutes');
      this.showNotification.emit(this.duration);
      this.displayingNotification = true;
      this.stop();
    }
  }
}
