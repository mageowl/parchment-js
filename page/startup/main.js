// Code
document.querySelector("button#new-project").addEventListener("click", () => {
	electronAPI.newProject();
});

document.querySelector("button#open-project").addEventListener("click", () => {
	electronAPI.openProject();
});
