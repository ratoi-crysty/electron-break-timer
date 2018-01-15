import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import * as electron from 'electron';
import { enableLiveReload } from 'electron-compile';
import nodeCommunicationService from './app/communication/node/node-communication.service';
import * as path from 'path';
import * as moment from 'moment';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;
let notificationsWindow: BrowserWindow | null;
let tray: Tray | null;
const browserWindows: BrowserWindow[] = [];

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload();
}

const destroyEverything = () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.destroy();
  }
  if (notificationsWindow && !notificationsWindow.isDestroyed()) {
    notificationsWindow.destroy();
  }
  if (tray && !tray.isDestroyed()) {
    tray.destroy();
  }
  browserWindows.splice(0);
};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 250,
    height: 250,
  });
  browserWindows.push(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/windows/main/main.html`);

  // Open the DevTools.
  if (isDevMode) {
    // mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    destroyEverything();
  });

  notificationsWindow = new BrowserWindow({
    width: 310,
    height: 70,
    x: electron.screen.getPrimaryDisplay().size.width - 310,
    y: 50,
    transparent: true,
    closable: false,
    focusable: false,
    skipTaskbar: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
    resizable: false,
    // maximizable: false,
    // minimizable: false,
  });
  // notificationsWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  // });
  browserWindows.push(notificationsWindow);

  // and load the index.html of the app.
  notificationsWindow.loadURL(`file://${__dirname}/windows/notifications/notifications.html`);

  // Open the DevTools.
  // if (isDevMode) {
  //   notificationsWindow.webContents.openDevTools();
  // }

  nodeCommunicationService.onInitMain(ipcMain, browserWindows);

  tray = new Tray(path.join(__dirname, 'favicon.ico'));
  tray.on('click', () => {
    if (!mainWindow || mainWindow.isVisible()) {
      return;
    }

    mainWindow.show();
  });

  nodeCommunicationService.listenToChannel('timer-started')
    .subscribe(
      (minutes: number) => {
        if (!tray) {
          return;
        }

        console.log(minutes);

        const newBreakDate = moment().add(minutes, 'minutes');
        tray.setToolTip(`Next break on ${newBreakDate.format('HH:mm:ss')}`);
      }
    );
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  console.log('All closed');
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.