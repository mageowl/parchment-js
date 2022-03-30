const { BrowserWindow, screen, dialog } = require("electron");
const path = require("path");
const fs = require("fs-extra");

/** @type {BrowserWindow} */
let startupWindow = null;

function createStartupWindow() {
	const window = new BrowserWindow({
		width: 700,
		height: 500,
		resizable: false,
		fullscreenable: false,
		movable: false,
		webPreferences: {
			preload: path.join(__dirname, "page/startup/preload.js")
		},
		titleBarStyle: "hidden"
	});

	window.loadFile("page/startup/index.html");

	startupWindow = window;
	window.on("closed", () => {
		startupWindow = null;
	});
}

async function createEditorWindow(envPath) {
	const window = new BrowserWindow({
		width: screen.getPrimaryDisplay().size.width,
		height: screen.getPrimaryDisplay().size.height,
		webPreferences: {
			preload: path.join(__dirname, "page/editor/preload.js")
		},
		titleBarStyle: "hidden"
	});

	window.loadURL(`file://${__dirname}/page/editor/index.html`);
	window.webContents.send("editor:path", envPath);
}

function newProject() {
	dialog
		.showOpenDialog(startupWindow ?? null, {
			title: "Select a folder for your project",
			buttonLabel: "Select",
			properties: ["openDirectory", "createDirectory"]
		})
		.then((directoryPath) => {
			if (directoryPath.filePaths[0]) {
				fs.copy(
					path.join(__dirname, "assets/project-template"),
					directoryPath.filePaths[0]
				).then(() => {
					const envPath = path.join(
						directoryPath.filePaths[0],
						"/Untitled.parchment"
					);

					createEditorWindow(envPath);
					startupWindow?.close?.();
				});
			}
		});
}

function openProject() {
	dialog
		.showOpenDialog(startupWindow ?? null, {
			title: "Select a project",
			buttonLabel: "Open",
			properties: ["openFile"],
			filters: [
				{ name: "Parchment Projects (.parchment)", extensions: ["parchment"] },
				{ name: "JSON Files (.json)", extensions: ["json"] }
			]
		})
		.then((directoryPath) => {
			if (directoryPath.filePaths[0]) {
				const envPath = directoryPath.filePaths[0];

				createEditorWindow(envPath);
				startupWindow.close();
			}
		});
}

module.exports = {
	newProject,
	openProject,
	createStartupWindow,
	startupWindow
};
