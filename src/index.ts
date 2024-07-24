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
      additionalArguments: ['--touch-events']
    },
  });

  try {
    // works with 1.1 too
    mainWindow.webContents.debugger.attach('1.2')
  } catch (err) {
    console.log('Debugger attach failed: ', err)
  }

  const isDebuggerAttached = mainWindow.webContents.debugger.isAttached()
  console.log('debugger attached? ', isDebuggerAttached)

  mainWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to: ', reason)
  });
  mainWindow.webContents.debugger.sendCommand('Emulation.setEmitTouchEventsForMouse', { enabled: true });
  // This is where the magic happens!
  mainWindow.webContents.debugger.sendCommand('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    configuration: 'mobile',
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



