const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const {
	newProject,
	openProject,
	createStartupWindow
} = require("./actions.js");
const appMenu = require("./appMenu.js");
const openCTX = require("./ctxMenus.js");

app.whenReady().then(() => {
	createStartupWindow();

	ipcMain.on("startup:new", () => {
		newProject();
	});

	ipcMain.on("startup:open", () => {
		openProject();
	});

	ipcMain.on("editor:ctx-menu", (_e, ...params) => {
		openCTX(...params);
	});

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createStartupWindow();
	});
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

Menu.setApplicationMenu(appMenu);
