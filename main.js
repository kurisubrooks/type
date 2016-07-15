const electron = require("electron")
const {app} = electron
const {BrowserWindow} = electron
let win

function spawn() {
    win = new BrowserWindow({
        width: 920,
        height: 600,
        show: false,
        frame: false,
        titleBarStyle: "hidden-inset",
        defaultEncoding: "UTF-8"
    })

    win.loadURL(`file://${__dirname}/index.html`)
    win.webContents.openDevTools()
    win.once("ready-to-show", () => win.show())
    win.on("closed", () => {
        win = null
    })
}

app.on("ready", spawn)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
    if (win === null) spawn()
})
