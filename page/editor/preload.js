const { contextBridge, ipcRenderer, Menu } = require("electron");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
let env = null;
let dirPath = null;
let resolvePath = null;
let pathCallback = new Promise((resolve) => (resolvePath = resolve));

ipcRenderer.on("editor:path", async (_event, envPath) => {
	dirPath = path.dirname(envPath);

	env = {
		...JSON.parse(await fs.readFile(envPath, "utf8")),
		name: path.basename(envPath).split(".")[0]
	};

	resolvePath(envPath);
});

ipcRenderer.on("editor:click-focused", () => {
	document.activeElement.dispatchEvent(new MouseEvent("dblclick"));
});

contextBridge.exposeInMainWorld("electronAPI", {
	getENV() {
		return env;
	},
	getDir() {
		return dirPath;
	},
	readDirectory(assetPath = "") {
		return fs.readdir(path.join(dirPath, assetPath));
	},
	readFile(assetPath) {
		return fs.readFileSync(path.join(dirPath, assetPath), "utf8");
	},
	whenPathLoaded() {
		return pathCallback;
	},
	isDirectory(assetPath) {
		return fs.statSync(path.join(dirPath, assetPath)).isDirectory();
	},
	joinPath(...paths) {
		return path.join(...paths);
	},
	popupCTXMenu(menu, ...params) {
		ipcRenderer.send("editor:ctx-menu", menu, ...params);
	},
	openPath(assetPath) {
		exec(`open ${path.join(dirPath, assetPath)}`);
	},
	whenFilesUpdated(callback) {
		ipcRenderer.on("editor:update-files", callback);
	}
});
