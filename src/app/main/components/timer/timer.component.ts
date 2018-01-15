import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId : module.id.split('\\').join('/'),
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  secondsLeft: number;
  interval: number;
  minutes: number;
  minutesLeft: number;
  nextNotification: Moment;

  @Output() showNotification = new EventEmitter();
  @Output() hideWindow = new EventEmitter();
  @Output() timeStart = new EventEmitter();
  @Input() restart$: Observable<null>;

  constructor() { }

  ngOnInit() {
    this.restart$
      .subscribe(
        () => this.start(),
      );
  }

  start() {
    if (!this.minutes) {
      return;
    }

    this.nextNotification = moment().add(this.minutes, 'minutes');

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.tick();
    this.interval = setInterval(this.tick.bind(this), 1000);
    this.timeStart.emit(this.minutes);
  }

  stop() {
    clearInterval(this.interval);
    delete this.interval;
  }

  hide() {
    this.hideWindow.emit();
  }

  private tick() {
    this.minutesLeft = this.nextNotification.diff(moment(), 'minutes');
    this.secondsLeft = this.nextNotification.diff(moment(), 'seconds');

    if (this.secondsLeft <= 0) {
      this.minutesLeft = this.nextNotification.diff(moment(), 'minutes');
      this.showNotification.emit();
      this.stop();
    }
  }
}
