import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { CommunicationDataModel } from '../models/communication-data.model';
import { ElectronService } from 'ngx-electron';
import { BaseCommunicationService } from '../util/base-communication.service';

@Injectable()
export class CommunicationService extends BaseCommunicationService {
  private communication$: Observable<CommunicationDataModel>;

  constructor(private electronService: ElectronService, private ngZone: NgZone) {
    super();
  }

  send(data: CommunicationDataModel) {
    this.electronService.ipcRenderer.send('communication-main', data);
  }

  listenToChannel(channel: string): Observable<any> {
    if (!this.communication$) {
      this.initObservable();
    }

    return this.communication$
      .filter((data: CommunicationDataModel) => data.channel === channel)
      .map((data: CommunicationDataModel) => data.value);
  }

  private initObservable() {
    this.communication$ = Observable.create((observer: Observer<any>) => {
      this.electronService.ipcRenderer.on('communication-render', (...values: any[]) => {
        this.ngZone.run(() => observer.next(<CommunicationDataModel> values[ 1 ]));
      });
    });
  }
}
