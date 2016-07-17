const electron = require("electron")
const os = require("os")
const path = require("path")
const {app} = electron
const {BrowserWindow} = electron
let win

function spawn() {
    let options = {
        title: "Type",
        icon: path.join(__dirname, "resources", "Icon.png"),
        minWidth: 300,
        minHeight: 94,
        width: 920,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        defaultEncoding: "UTF-8",
        backgroundColor: "#EEEEEE"
    }

    if (os.platform() == "darwin") {
        options.icon = path.join(__dirname, "resources", "Icon.icns")
        options.titleBarStyle = "hidden-inset"
    }

    if (os.platform() == "win32") {
        options.title = ""
        options.icon = path.join(__dirname, "resources", "Icon.ico")
    }

    win = new BrowserWindow(options)

    win.loadURL(`file://${__dirname}/index.html`)
    //win.webContents.openDevTools()
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
