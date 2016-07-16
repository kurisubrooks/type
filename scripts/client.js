const fs = require("fs")
const $ = require("jquery")
const electron = require("electron")
const {remote} = electron
const {dialog} = remote

const dropbox = document.getElementById("global")
const $editor = $("#editor")
const $title = $("#title")

function checkFileType(name, mime) {
    let splice = name.split(".")
    let last = splice[splice.length - 1]
    return (fileTypes.indexOf(last) >= 0) ? true : false
}

function setDocument(file, content) {
    console.log(file)
    $editor.val("")
    $editor.val(content)
    $title.text(file.name)
}

function saveDocument(type) {
    dialog.showSaveDialog({
        title: "Save",
        buttonLabel: "Save",
        defaultPath: __dirname,
        filters: [ { name: "text", extensions: ["txt"] } ]
    }, (filename) => {
        if (!filename) return
        fs.writeFile(filename, $editor.val(), (err) => {
            if (err) console.error(err)
        })
    })
}

function insertAtCursor(value) {
    var cursorPos = $editor.prop("selectionStart")
    var v = $editor.val()
    var textBefore = v.substring(0, cursorPos)
    var textAfter  = v.substring(cursorPos, v.length)
    $editor.val(textBefore + $(this).val() + textAfter)
}

function typeInTextarea(ins) {
    var start = $editor.prop("selectionStart")
    var end = $editor.prop("selectionEnd")
    var text = $editor.val()
    var before = text.substring(0, start)
    var after  = text.substring(end, text.length)
    $editor.val(before + ins + after)
    $editor[0].selectionStart = $editor[0].selectionEnd = start + ins.length
    $editor.focus()
    return false
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
        typeInTextarea("	")
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

    fs.readFile(file.path, "utf-8", (err, data) => {
        if (err) throw err
        setDocument(file, data)
    })

    return false
}
