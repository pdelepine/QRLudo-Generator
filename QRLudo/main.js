/* Fichier main.js nécessaire d'electron */
const { app,BrowserWindow } = require("electron");
const path = require("path");
const log4js = require("log4js");



/** Setup de 2 actions lors d'un log
 * console : réalise un console.log
 * toFile : enrengistre le log dans le fichier qrludogenerator.log
 */
log4js.configure({
    appenders: {
        console: { type: "console" },
        toFile: {
            type: "file",
            filename: `${app.getPath("userData")}/qrludogenerator.log`,
            flags: "w",
        },
    },
    categories: {
        default: { appenders: ["console","toFile"],level: "info" },
    },
});

/** Objet globale gérant l'onglet d'aide à afficher */
global.sharedObject = {
    loggerShared: log4js,
}

function createWindow ()
{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname,"preload.js"),
        },
    });

    win.loadFile(path.normalize(__dirname + '/dist/index.html'));
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




