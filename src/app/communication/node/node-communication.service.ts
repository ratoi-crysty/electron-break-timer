import { EventEmitter, BrowserWindow } from 'electron';
import { CommunicationDataModel } from '../models/communication-data.model';
import { BaseCommunicationService } from '../util/base-communication.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export class NodeCommunicationService extends BaseCommunicationService {
  browserWindows: BrowserWindow[];
  private communication$: Observable<CommunicationDataModel>;

  onInitMain(ipcMain: EventEmitter, browserWindows: BrowserWindow[]) {
    this.browserWindows = browserWindows;

    this.communication$ = Observable.create((observer: Observer<any>) => {
      ipcMain.on('communication-main', (...values: any[]) => {
        const data: CommunicationDataModel = values[ 1 ];
        if (data.toRenderer) {
          this.send(data);
        } else {
          observer.next(data);
        }
      });
    });
  }

  send(data: CommunicationDataModel) {
    this.browserWindows.forEach((browserWindow: BrowserWindow) => browserWindow.webContents
      .send('communication-render', data));
  }

  listenToChannel(channel: string): Observable<any> {
    if (!this.browserWindows) {
      throw new Error('Not initialised!');
    }

    return this.communication$
      .filter((data: CommunicationDataModel) => data.channel === channel)
      .map((data: CommunicationDataModel) => data.value);
  }
}

export default new NodeCommunicationService();
