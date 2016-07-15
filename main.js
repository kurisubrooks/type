const electron = require("electron")
const os = require("os")
const {app} = electron
const {BrowserWindow} = electron
let win

function spawn() {
    let options = {
        width: 920,
        height: 600,
        show: false,
        defaultEncoding: "UTF-8"
    }

    if (os.platform() == "darwin") {
        options.frame = false
        options.titleBarStyle = "hidden-inset"
    }

    win = new BrowserWindow(options)

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
