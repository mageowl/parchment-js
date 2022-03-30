let explorerPath = "";
let viewedScene = "";

electronAPI.whenPathLoaded().then(() => {
	document
		.querySelectorAll("div.titlebar, title")
		.forEach((e) => (e.innerText = `${electronAPI.getENV().name}`));

	updateFileExplorer();
});

function updateFileExplorer() {
	const breadcrumbs = document.querySelector(
		"div#assets.editor-container > span#breadcrumbs"
	);

	breadcrumbs.innerHTML = "";

	const homeEl = document.createElement("img");
	homeEl.src = "../../assets/icons/house-solid.svg";
	homeEl.height = 18;
	homeEl.addEventListener("click", () => {
		explorerPath = "";
		updateFileExplorer();
	});

	breadcrumbs.append(
		homeEl,
		" / ",
		...explorerPath.split("/").flatMap((folder, i) => {
			if (folder.length === 0) return "";
			const el = document.createElement("span");
			el.innerText = folder;
			el.addEventListener("click", () => {
				explorerPath = explorerPath
					.split("/")
					.slice(0, i + 1)
					.join("/");
				updateFileExplorer();
			});

			return [el, " / "];
		})
	);

	electronAPI.readDirectory(explorerPath).then((files) => {
		const assetWindow = document.querySelector(
			"div#assets.editor-container > div#files"
		);

		assetWindow.innerHTML = "";

		files
			.filter((p) =>
				electronAPI.isDirectory(electronAPI.joinPath(explorerPath, p))
			)
			.forEach((folder) => {
				const el = document.createElement("div");
				el.classList.add("file");
				el.tabIndex = 0;

				el.addEventListener("dblclick", () => {
					explorerPath = electronAPI.joinPath(explorerPath, folder);
					updateFileExplorer();
				});

				const nameEl = document.createElement("span");
				nameEl.innerText = folder;
				setTimeout(() => {
					if (nameEl.getBoundingClientRect().width > 125)
						nameEl.innerHTML = folder
							.replaceAll("<", "&lt;")
							.replaceAll("&", "&amp;")
							.replaceAll(".", "<br>.");
					else nameEl.innerHTML += "<br>&nbsp;";
				});

				const iconEl = document.createElement("img");
				iconEl.src = `../../assets/file-icons/folder.svg`;

				el.append(iconEl, nameEl);
				assetWindow.append(el);
			});

		files
			.filter(
				(p) => !electronAPI.isDirectory(electronAPI.joinPath(explorerPath, p))
			)
			.forEach((file) => {
				const el = document.createElement("div");
				el.classList.add("file");
				el.tabIndex = 0;

				el.addEventListener("contextmenu", () => {
					el.focus();
					electronAPI.popupCTXMenu(
						"file",
						electronAPI.joinPath(electronAPI.getDir(), explorerPath, file)
					);
				});

				el.addEventListener("dblclick", () => {
					if (type !== "scene") {
						electronAPI.openPath(electronAPI.joinPath(explorerPath, file));
					} else {
						viewedScene = electronAPI.joinPath(explorerPath, file);
						updateView();
					}
				});

				const nameEl = document.createElement("span");
				nameEl.innerText = file;
				setTimeout(() => {
					if (nameEl.getBoundingClientRect().width > 125)
						nameEl.innerHTML = file
							.replaceAll("<", "&lt;")
							.replaceAll("<", "&gt;")
							.replaceAll(".", "<br>.");
					else nameEl.innerHTML += "<br>&nbsp;";
				});

				const iconEl = document.createElement("img");
				let ext = file.split(".")[1];
				let icon = "file";
				let type = null;

				switch (ext) {
					case "js": {
						type = electronAPI
							.readFile(electronAPI.joinPath(explorerPath, file))
							.split("\n")
							.find((s) => s.trim().startsWith("//pType"))
							?.split?.("#")?.[1];

						switch (type) {
							case "scene": {
								icon = "scene";
								break;
							}
							case "component": {
								icon = "component";
								break;
							}
							default: {
								icon = "js";
							}
						}
						break;
					}
					case "png":
					case "jpeg": {
						icon = "img";
						break;
					}
					case "parchment": {
						icon = "config";
						break;
					}
					case "html": {
						icon = "html";
						break;
					}
					case "json": {
						icon = "json";
						break;
					}
				}

				iconEl.src = `../../assets/file-icons/${icon}.svg`;

				el.append(iconEl, nameEl);
				assetWindow.append(el);
			});
	});
}

function updateView() {}

electronAPI.whenFilesUpdated(updateFileExplorer);
