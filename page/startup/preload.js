const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	newProject: () => {
		ipcRenderer.send("startup:new");
	},
	openProject: () => {
		ipcRenderer.send("startup:open");
	}
});
