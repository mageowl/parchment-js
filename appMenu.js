const { BrowserWindow, dialog, Menu, MenuItem, app } = require("electron");
const { startupWindow, newProject, openProject } = require("./actions.js");

const cmdCtrl = process.platform === "darwin" ? "Cmd" : "Ctrl";

const appMenu = Menu.buildFromTemplate([
	{
		label: "Parchment JS",
		role: "appMenu",
		submenu: [
			{
				label: "Start Window",
				click() {
					if (startupWindow == null) createStartupWindow();
					else startupWindow.focus();
				}
			},
			{
				label: "Preferences",
				click() {
					dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
						message: "Not implemented."
					});
				}
			},
			{
				type: "separator"
			},
			{
				role: "quit"
			}
		]
	},
	{
		label: "File",
		role: "fileMenu",
		submenu: [
			{
				label: "New Project",
				accelerator: `${cmdCtrl}+Shift+N`,
				click() {
					newProject();
				}
			},
			{
				label: "Open Project",
				accelerator: `${cmdCtrl}+Shift+O`,
				click() {
					openProject();
				}
			},
			{
				type: "separator"
			},
			{
				label: "New...",
				submenu: [
					{
						label: "not implemented..."
					}
				]
			},
			{
				type: "separator"
			},
			{
				role: "close"
			}
		]
	},
	{
		role: "editMenu"
	},
	{
		label: "Dev Tools",
		submenu: [
			{
				role: "toggleDevTools"
			},
			{
				role: "reload"
			}
		]
	},
	{
		role: "windowMenu"
	}
]);

module.exports = appMenu;
