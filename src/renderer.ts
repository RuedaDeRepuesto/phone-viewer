
import '../node_modules/material-icons/iconfont/material-icons.css';
import './index.css';

import { WebviewTag, app, ipcMain, ipcRenderer } from 'electron';
import { ElectronAPIBridge } from './types/apiBridge';



const electronSrv:ElectronAPIBridge = (window as any).electronAPI;

document.addEventListener("DOMContentLoaded", (e) => { 
    main();
});


function main(){

    console.trace('Renderer main called!');
    
    const urlInput = document.getElementById('url') as HTMLInputElement;
    const closeButton = document.getElementById('close') as HTMLButtonElement;
    const backButton = document.getElementById('back') as HTMLButtonElement;
    const refreshButton = document.getElementById('refresh') as HTMLButtonElement;
    const devToolsButton = document.getElementById('tools') as HTMLButtonElement;
    const clock = document.getElementById('hour') as HTMLParagraphElement;

    
    setInterval(()=>{time(clock)}, 1000);


    const webview = document.querySelector<WebviewTag>('webview');
    webview.addEventListener('dom-ready',async ()=>{
        console.log('WEBVIEW-LOADED!',webview);
        await webview.insertCSS(':root{--ion-safe-area-top:59px;--ion-safe-area-bottom:22px}')
        await webview.insertCSS('*{scrollbar-width: none!important;}');
        await webview.insertCSS('*::part(scroll){scrollbar-width:none;}')
    });

    urlInput.onchange = () =>{
        const val = urlInput.value;
        webview.loadURL(val);
    }

    closeButton.onclick= () =>{
        electronSrv.appClose();
    }

    refreshButton.onclick = () => {
        webview.reload();
    }

    devToolsButton.onclick = () => {
        if(!webview.isDevToolsOpened()){
            webview.openDevTools();
        }
    }

    backButton.onclick = () => {
        if(webview.canGoBack()){
            webview.goBack();
        }
    }
    
}


function time(clock:HTMLParagraphElement) {
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    clock.textContent = 
      ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
}