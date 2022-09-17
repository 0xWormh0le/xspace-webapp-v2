import React, { Component } from 'react'
import * as JSZip from "jszip";
import * as JSZipUtils from "jszip-utils";
// import axios from 'axios';


function downloadZipIfAllReady(id, file_confirmation, zip, filenameSave) {
    console.log(id, file_confirmation, zip, filenameSave)
    file_confirmation.every(function (element, index, array) {
        if (element) {
            // console.log(id + ' / ' + file_confirmation);
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    var a = document.getElementById("downloadArea")
                    console.log(a)
                    console.log(filenameSave)
                    a.download = filenameSave
                    a.href = URL.createObjectURL(content)
                    a.click()
                })
        }
        //return element;
    })
}

function urlToPromise(url) {
    console.log('urltopromise', url)
    return new Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            // console.log('data', data)
            // on error get binary did not expect a buffer array and runs into CORS error...
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function zipFiles(id, urls, file_name, file_confirmation, filenameSave) {
    // var __ = this;
    var zip = new JSZip()
    if (urls.length > 0) {
        var base64Data = []
        var dic = {base64: true, binary: true}
        for (let i = 0; i < urls.length; i++) {
            /*-------------------------------------------------- */
            var fname = file_name[i];
            var imageUrl = urls[i];
            zip.file(fname, urlToPromise(imageUrl), dic)
            /*----------------------------------------------- */
        }
        file_confirmation[0] = true
        downloadZipIfAllReady(id, file_confirmation, zip, filenameSave)
    } else {
        alert('Please select a file')
    }
}

function downloadAsset(props) {
    const fileInfo = props.fileInfo
    const fileType = props.fileType
    // console.log('fileInfo', fileInfo)
    // console.log('fileInfo.link', fileInfo.link)
    const file_confirmation = [false, false]
    let url
    let urlList = []
    let filenames = []
    url = fileInfo.link.split('/')
    urlList.push(fileInfo.link)
    filenames.push(url[url.length - 1])

    const rightNow = new Date()
    const res = rightNow.toISOString().slice(0, 10).replace(/-/g, "")
    let filenameSave = "XSPACE_Content_"
    filenameSave = filenameSave+res+".zip"
    zipFiles('downloadArea', urlList, filenames, file_confirmation, filenameSave)
}

export default downloadAsset
