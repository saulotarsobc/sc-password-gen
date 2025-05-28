import { contextBridge } from "electron";

export const api = {};

contextBridge.exposeInMainWorld("api", api);