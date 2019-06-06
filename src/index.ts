import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import * as electron from 'electron';
import { enableLiveReload } from 'electron-compile';
import nodeCommunicationService from './app/communication/node/node-communication.service';
import * as path from 'path';
import * as moment from 'moment';

// Keep a global reference of the win
// dow object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;
let notificationsWindow: BrowserWindow | null;
let tray: Tray | null;
const browserWindows: BrowserWindow[] = [];

const isDevMode = process.env.NODE_ENV === 'development';

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

const createWindows = () => {
  const coffeeBreakIcon = electron.nativeImage
    .createFromPath(path.join(__dirname, 'assets', 'images', 'coffee-break.png'));

  coffeeBreakIcon.resize({
    width: 64,
    height: 64,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 415,
    height: 240,
  });
  browserWindows.push(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/windows/main/main.html`);

  // Open the DevTools.
  if (isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    destroyEverything();
  });

  // Open the DevTools.
  if (isDevMode) {
    notificationsWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });
    notificationsWindow.webContents.openDevTools();
  } else {
    notificationsWindow = new BrowserWindow({
      width: 310,
      height: 80,
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
      icon: path.join(__dirname, 'save.png_64x64.png'),
      // maximizable: false,
      // minimizable: false,
    });
  }

  browserWindows.push(notificationsWindow);

  // and load the index.html of the app.
  notificationsWindow.loadURL(`file://${__dirname}/windows/notifications/notifications.html`);


  nodeCommunicationService.onInitMain(ipcMain, browserWindows);

  tray = new Tray(coffeeBreakIcon);
  tray.on('click', () => {
    if (!mainWindow) {
      return;
    }
    if (mainWindow.isVisible()) {
      mainWindow.focus();
    } else {
      mainWindow.show();
    }
  });

  tray.setToolTip('Please set the time until the next break');

  nodeCommunicationService.listenToChannel('timer-started')
    .subscribe(
      (minutes: number) => {
        if (!tray) {
          return;
        }

        const newBreakDate = moment().add(minutes, 'minutes');
        tray.setToolTip(`Next break on ${newBreakDate.format('HH:mm:ss')}`);
      }
    );
};

const initWindows = () => {
  setTimeout(() => createWindows(), 1000);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initWindows);

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
    initWindows();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
