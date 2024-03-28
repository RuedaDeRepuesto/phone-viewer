// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')
import { ElectronAPIBridge } from './types/apiBridge';

let apiDefinition:ElectronAPIBridge = {
    appClose: () => ipcRenderer.send('app-close')
}

contextBridge.exposeInMainWorld('electronAPI', apiDefinition);