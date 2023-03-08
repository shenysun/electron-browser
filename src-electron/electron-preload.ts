import { contextBridge, ipcRenderer } from 'electron';
import { EventType } from './events';

contextBridge.exposeInMainWorld('browser', {
    setBounds: (x: number, y: number, width: number, height: number) => {
        return ipcRenderer.invoke(EventType.setBounds, { x, y, width, height });
    },

    setUrl: (url: string) => {
        return ipcRenderer.invoke(EventType.setUrl, url);
    },

    getUrl: () => {
        return ipcRenderer.invoke(EventType.getUrl);
    },

    onCanGoBackChange: async (callback: (...args: any[]) => any) => {
        ipcRenderer.on(EventType.canGoBack, (event, a) => {
            callback(a);
        });
        callback(await ipcRenderer.invoke(EventType.canGoBack));
    },

    onCanGoForwardChange: async (callback: (...args: any[]) => any) => {
        ipcRenderer.on(EventType.canGoForward, (event, a) => {
            callback(a);
        });
        callback(await ipcRenderer.invoke(EventType.canGoForward));
    },

    onUrlChange: async (callback: (...args: any[]) => any) => {
        ipcRenderer.on(EventType.updateURL, (event, a) => {
            callback(a);
        });
        callback(await ipcRenderer.invoke(EventType.getUrl));
    },

    goBack: () => {
        ipcRenderer.invoke(EventType.goBack);
    },

    goForward: () => {
        ipcRenderer.invoke(EventType.goForward);
    },

    refresh: () => {
        ipcRenderer.invoke(EventType.refresh);
    },

    home: () => {
        ipcRenderer.invoke(EventType.home);
    },
});
