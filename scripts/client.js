const fs = require("fs")
const $ = require("jquery")
const electron = require("electron")
const {remote} = electron
const {dialog} = remote

const dropbox = document.getElementById("global")
const editor = $("#editor")

let fileTypes = ["txt", "md"]
let workingDirectory = "./" || __dirname

function checkFileType(name, mime) {
    let splice = name.split(".")
    let last = splice[splice.length - 1]
    return (fileTypes.indexOf(last) >= 0) ? true : false
}

function setDocument(content) {
    editor.val("")
    editor.val(content)
}

function saveDocument(type) {
    /*let splice = type.split(".")
    let extension = splice[splice.length - 1]*/

    dialog.showSaveDialog({
        title: "Save",
        buttonLabel: "Save",
        defaultPath: __dirname,
        filters: [
            { name: "text", extensions: ["txt"] }
        ]
    }, (filename) => {
        if (!filename) return
        fs.writeFile(filename, editor.val(), (err) => {
            if (err) console.error(err)
        })
    })
}

document.onkeydown = function (e) {
    // ctrl/cmd + s
    if (e.ctrlKey || e.metaKey) {
        if (e.keyCode == 83) {
            e.preventDefault()
            e.stopPropagation()
            saveDocument()
        }
    }

    // tab
    if (e.keyCode == 9) {
        e.preventDefault()
        // insert `    ` at cursor
    }
}

dropbox.ondragover = dropbox.ondragend = dropbox.ondragleave = () => {
    return false
}

dropbox.ondrop = (e) => {
    e.preventDefault()

    const file = e.dataTransfer.files[0]
    const name = file.name
    const type = file.type
    const path = file.path
    const size = file.size

    console.log("New File, Drag")

    //if (checkFileType(file.name)) {
        console.log("File Type Supported, Reading")
        // type supported, run file
        fs.readFile(file.path, "utf-8", (err, data) => {
            if (err) throw err
            setDocument(data)

            console.log("File Loaded\n")

            //console.log(data)
        })
    /*} else {
        // type unsupported, show error
        alert(`"${file.name.split(".")[(file.name.split(".")).length - 1]}" is an unsupported file type`)
    }*/

    //console.log(file)

    return false
}
