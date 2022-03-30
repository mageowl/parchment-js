const { Menu, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const fs = require("fs-extra");
let menuParameters = [];

const ctxMenus = {
	file: Menu.buildFromTemplate([
		{
			label: "Open",
			click() {
				BrowserWindow.getFocusedWindow().webContents.send(
					"editor:click-focused"
				);
			}
		},
		{
			label: "Open File with VS Code",
			click() {
				exec(`code ${menuParameters[0]}`);
			}
		},
		{ type: "separator" },
		{
			label: "Delete File",
			click() {
				fs.rm(menuParameters[0]).then(() => {
					BrowserWindow.getFocusedWindow().webContents.send(
						"editor:update-files"
					);
				});
			}
		}
	])
};

function openCTX(id, ...params) {
	menuParameters = params;
	ctxMenus[id].popup();
}

module.exports = openCTX;
