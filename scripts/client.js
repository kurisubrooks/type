const fs = require("fs")
const electron = require("electron")
const process = require("process")
const {remote} = electron
const {dialog} = remote

const $ = require("jquery")
const $editor = $("#editor")
const $title = $("#title")
const drop = document.getElementById("global")

function checkFileType(name, mime) {
    let splice = name.split(".")
    let last = splice[splice.length - 1]
    return (fileTypes.indexOf(last) >= 0) ? true : false
}

function setDocument(file, content) {
    $editor.val("")
    $editor.val(content)
    setTitle(file.name)
}

function setTitle(title) {
    $title.text(title)
}

function saveDocument(type) {
    dialog.showSaveDialog({
        title: "Save",
        buttonLabel: "Save",
        defaultPath: (process.env.HOME) ? process.env.HOME : __dirname/*,
        filters: [ { name: "text", extensions: ["txt"] } ]*/
    }, (filename) => {
        if (!filename) return
        fs.writeFile(filename, $editor.val(), (err) => {
            if (err) console.error(err)
            setTitle(filename.split("/")[filename.split("/").length - 1])
        })
    })
}

function insertAtCursor(value) {
    let cursorPos = $editor.prop("selectionStart")
    let v = $editor.val()
    let textBefore = v.substring(0, cursorPos)
    let textAfter  = v.substring(cursorPos, v.length)
    $editor.val(textBefore + $(this).val() + textAfter)
}

function typeInTextarea(ins) {
    let start = $editor.prop("selectionStart")
    let end = $editor.prop("selectionEnd")
    let text = $editor.val()
    let before = text.substring(0, start)
    let after  = text.substring(end, text.length)
    $editor.val(before + ins + after)
    $editor[0].selectionStart = $editor[0].selectionEnd = start + ins.length
    $editor.focus()
    return false
}

$(function() {
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

    drop.ondragover = () => {
        return false
    }

    drop.ondragend = () => {
        return false
    }

    drop.ondragleave = () => {
        return false
    }

    drop.ondrop = (e) => {
        e.preventDefault()

        const file = e.dataTransfer.files[0]
        const name = file.name // File Name
        const type = file.type // MIME type
        const path = file.path // File Path
        const size = file.size // File Size (in Bytes)

        fs.readFile(file.path, "utf-8", (err, data) => {
            if (err) throw err
            setDocument(file, data)
        })

        return false
    }
})
