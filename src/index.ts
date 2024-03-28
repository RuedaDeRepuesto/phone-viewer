import { app, BrowserWindow, ipcMain } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    title:'PhoneView',
    icon:'./assets/appicon.png',
    height: 920,
    width: 430,
    resizable:false,
    frame:false,
    transparent:true,
    titleBarStyle:'hidden',
    webPreferences: {
      nodeIntegration:true,
      webviewTag:true,
      webSecurity:false,
      allowRunningInsecureContent:true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  ipcMain.on('app-close', (event) => {
    app.exit();
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



