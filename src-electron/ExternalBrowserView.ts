import { BrowserView, BrowserWindow, ipcMain, Notification } from 'electron';
// import path from 'path';
import { EventType } from './events';

export class ExternalBrowserView {
    private view: BrowserView;
    private mainWindow: BrowserWindow;
    private homeUrl: string;

    constructor(url: string, parent: BrowserWindow) {
        this.homeUrl = url;
        this.mainWindow = parent;
        this.view = new BrowserView();
        this.view.webContents.loadURL(url);
        this.view.setBounds({ x: 0, y: 100, width: 500, height: 700 });
        this.view.setAutoResize({ width: true, height: true });
        parent.addBrowserView(this.view);

        this.registerHandler();
        this.initWebContents();
    }

    registerHandler() {
        ipcMain.handle(EventType.setBounds, (e, rect: Electron.Rectangle) => {
            this.view.setBounds(rect);
        });
        ipcMain.handle(EventType.setUrl, (e, url) => {
            return this.loadUrl(url);
        });

        ipcMain.handle(EventType.getUrl, () => {
            return this.view.webContents.getURL();
        });

        ipcMain.handle(EventType.canGoBack, () => {
            return this.view.webContents.canGoBack();
        });

        ipcMain.handle(EventType.canGoForward, () => {
            return this.view.webContents.canGoForward();
        });

        ipcMain.handle(EventType.goBack, () => {
            return this.view.webContents.goBack();
        });

        ipcMain.handle(EventType.goForward, () => {
            return this.view.webContents.goForward();
        });

        ipcMain.handle(EventType.refresh, () => {
            return this.loadUrl(this.view.webContents.getURL());
        });

        ipcMain.handle(EventType.home, () => {
            return this.loadUrl(this.homeUrl);
        });
    }

    initWebContents() {
        const { webContents } = this.view;
        webContents.setWindowOpenHandler((details) => {
            this.loadUrl(details.url);
            return { action: 'deny' };
        });

        webContents.on('did-navigate', () => {
            this.mainWindow.webContents.send(EventType.canGoBack, webContents.canGoBack());
            this.mainWindow.webContents.send(EventType.canGoForward, webContents.canGoForward());
            this.mainWindow.webContents.send(EventType.updateURL, webContents.getURL());
        });
    }

    async loadUrl(url: string) {
        const { webContents } = this.view;
        await webContents.loadURL(url);
        this.mainWindow.webContents.send(EventType.canGoBack, webContents.canGoBack());
        this.mainWindow.webContents.send(EventType.canGoForward, webContents.canGoForward());
        this.mainWindow.webContents.send(EventType.updateURL, webContents.getURL());
    }
}
