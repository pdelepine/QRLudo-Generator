/* Fichier main.js nécessaire d'electron */
const { app,BrowserWindow } = require("electron");
const { join } = require("path");

function createWindow ()
{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname,"preload.js"),
        },
    });

    win.loadFile("dist/index.html");
}

app.whenReady().then(() =>
{
    createWindow();

    app.on("activate",() =>
    {
        if (BrowserWindow.getAllWindows().length === 0)
        {
            createWindow();
        }
    });
});

app.on("window-all-closed",() =>
{
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});
