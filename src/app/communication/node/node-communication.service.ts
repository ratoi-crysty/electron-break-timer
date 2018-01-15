import { EventEmitter, BrowserWindow } from 'electron';
import { CommunicationDataModel } from '../models/communication-data.model';

export class NodeCommunicationService {
  onInitMain(ipcMain: EventEmitter, browserWindows: BrowserWindow[]) {
    ipcMain.on('communication-main', (...values: any[]) => {
      const data: CommunicationDataModel = values[ 1 ];
      browserWindows.forEach((browserWindow: BrowserWindow) => browserWindow.webContents
        .send('communication-render', data));
    });
  }
}

export default new NodeCommunicationService();
