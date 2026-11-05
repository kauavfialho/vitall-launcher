'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('vital', {
  listar: () => ipcRenderer.invoke('apps:listar'),
  instalar: id => ipcRenderer.invoke('apps:instalar', id),
  abrir: id => ipcRenderer.invoke('apps:abrir', id),
  versao: () => ipcRenderer.invoke('launcher:versao'),
  aoProgresso: fn => ipcRenderer.on('apps:progresso', (_e, d) => fn(d))
});
