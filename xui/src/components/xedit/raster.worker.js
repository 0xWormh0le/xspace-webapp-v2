// import resizeImageData from "resize-image-data";

let originalImg
let w
let h
let r = []
let g = []
let b = []
let a = []
let rasterImgData = []
let maskImgData = []
let drawing = []
let canvas = {drawing: null, temp: null}
let canvasw
let canvash
let scale
let ctx = {drawing: null, temp: null}
let maskImgBitmap
let scaleX
let scaleY
let scaleAvg
let originalImgChannels
let maskImgChannels


addEventListener('message', (messageData) => {
    console.log('worker received:', messageData)
    switch (messageData.data.type) {
        case 'start':
            // start the rendering
            originalImg = messageData.data.originalImage
            w = originalImg.width
            canvasw = messageData.data.displayWidth
            h = originalImg.height
            canvash = messageData.data.displayHeight
            rasterImgData = originalImg.data
            maskImgData = messageData.data.maskImage
            drawing = messageData.data.drawing
            scale = messageData.data.scale
            canvas.drawing = messageData.data.canvas
            canvas.temp = messageData.data.canvas
            maskImgBitmap = messageData.data.maskImgBitmap
            ctx.drawing = canvas.drawing.getContext('2d')
            ctx.drawing.canvas.width = w
            ctx.drawing.canvas.height = h
            ctx.drawing.putImageData(maskImgData, 0, 0, 0, 0, w, h)
            ctx.temp = canvas.temp.getContext('2d')
            ctx.temp.canvas.width = w
            ctx.temp.canvas.height = h
            originalImgChannels = originalImg.data.length/(w*h)
            maskImgChannels = maskImgData.data.length/(w*h)

            // locally cache the scale
            scaleX = w/canvasw
            scaleY = h/canvash
            scaleAvg = (scaleX + scaleY) / 2

            // prep mask to make calc's down the road faster
            // and grab the rgb channels
            // and prep the canvas
            console.log(1)

            for (let i = 0; i < originalImgChannels * (w * h); i += originalImgChannels) {
                // r.push(originalImg.data[i])
                // g.push(originalImg.data[i + 1])
                // b.push(originalImg.data[i + 2])
                a.push(maskImgData.data[i])
            }

            console.log(2)
            // prep rasterImgData
            for (let i = 0; i < originalImgChannels * (w * h); i += originalImgChannels) {
                rasterImgData[i + 3] = a[i*.25]
            }
            // console.log('values at the end of the setup', ctx.drawing.getImageData(0,0, w, h),
            //     maskImgBitmap, maskImgData.data, messageData.data.maskImage)
            postMessage({type: 'update', data: originalImg})
            break
        case 'updateMask':
            // let newCanvasData = ctx.drawing.getImageData(0,0, w, h)
            // console.log('original newCanvasData', newCanvasData)
            drawing = messageData.data.drawing
            if (scaleAvg !== 1) {
                // console.log('scaling points from:', drawing)
                for (let i = 0; i < drawing.lines.length; i++) {
                    drawing.lines[i].brushRadius *= scaleAvg
                    for (let j = 0; j < drawing.lines[i].points.length; j++) {
                        drawing.lines[i].points[j].x *= scaleX
                        drawing.lines[i].points[j].y *= scaleY
                    }
                }
                // console.log('scaling points to:', drawing)
            }

            // store the current globalCompositeOperation
            const compositeOperation = ctx.temp.globalCompositeOperation

            //set to draw behind current content
            ctx.temp.globalCompositeOperation = "source-over"

            // set the drawing back to just the mask
            ctx.drawing.putImageData(maskImgData, 0, 0, 0, 0, w, h)

            // draw the incoming points
            drawing.lines.forEach(line => {
                const {points, brushColor, brushRadius} = line

                // Draw the points
                drawPoints({
                    points,
                    brushColor,
                    brushRadius
                })
            })

            // get the new canvas data
            const newCanvasData = ctx.drawing.getImageData(0,0, w, h)
            console.log('after newCanvasData', newCanvasData)
            // reset the composite globalCompositeOperation
            ctx.drawing.globalCompositeOperation = compositeOperation
            a = []
            // apply the new mask to the raster
            for (let i = 0; i < 4 * (w * h); i += 4) {
                rasterImgData[i + 3] = newCanvasData.data[i]
                a.push(newCanvasData.data[i])
            }

            postMessage({type: 'update', data: originalImg})
            break

        case 'newImageIncoming':
            // admin work to accept new image

            // **********OLD METHOD****************
            // originalImg = messageData.data.originalImage
            // w = originalImg.width
            // canvasw = messageData.data.displayWidth
            // h = originalImg.height
            // canvash = messageData.data.displayHeight
            // rasterImgData = originalImg.data
            // maskImgData = messageData.data.maskImage
            // drawing = messageData.data.drawing
            // scale = messageData.data.scale
            // maskImgBitmap = messageData.data.maskImgBitmap
            // console.log('canvas', canvas)
            // ctx.drawing = canvas.drawing.getContext('2d')
            // ctx.drawing.clearRect(0,0, w, h)
            // ctx.drawing.canvas.width = w
            // ctx.drawing.canvas.height = h
            // ctx.drawing.putImageData(maskImgData, 0, 0, 0, 0, w, h)
            // ctx.temp = canvas.temp.getContext('2d')
            // ctx.temp.canvas.width = w
            // ctx.temp.canvas.height = h

            originalImg = messageData.data.originalImage
            w = originalImg.width
            canvasw = messageData.data.displayWidth
            h = originalImg.height
            canvash = messageData.data.displayHeight
            rasterImgData = originalImg.data
            maskImgData = messageData.data.maskImage
            drawing = messageData.data.drawing
            scale = messageData.data.scale
            canvas.drawing = messageData.data.canvas
            canvas.temp = messageData.data.canvas
            maskImgBitmap = messageData.data.maskImgBitmap
            ctx.drawing = canvas.drawing.getContext('2d')
            ctx.drawing.canvas.width = w
            ctx.drawing.canvas.height = h
            ctx.drawing.putImageData(maskImgData, 0, 0, 0, 0, w, h)
            ctx.temp = canvas.temp.getContext('2d')
            ctx.temp.canvas.width = w
            ctx.temp.canvas.height = h


            // locally cache the scale
            scaleX = w/canvasw
            scaleY = h/canvash
            scaleAvg = (scaleX + scaleY) / 2

            // prep mask to make calc's down the road faster
            // and grab the rgb channels
            // and prep the canvas
            r = []
            g = []
            b = []
            a = []

            for (let i = 0; i < 4 * (w * h); i += 4) {
                // r.push(originalImg.data[i])
                // g.push(originalImg.data[i + 1])
                // b.push(originalImg.data[i + 2])
                a.push(maskImgData.data[i])
            }

            // prep rasterImgData
            for (let i = 0; i < 4 * (w * h); i += 4) {
                rasterImgData[i + 3] = a[i*.25]
            }

            postMessage({type: 'update', data: originalImg})
            break
        case 'save':
            // console.log('save', messageData.data, messageData.data.data.original_url)
            postMessage({type: 'save', data: JSON.stringify({
                    height: h,
                    width: w,
                    original_url: messageData.data.data.original_url,
                    mask_url: messageData.data.data.mask_url,
                    product_info: messageData.data.data.product_info,
                    data: a,
                })
            })
            break
        case 'stop':
            // terminate worker
            close()
            break
    }
})

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    }
}

function drawPoints({ points, brushColor, brushRadius }) {
    // console.log('ctx temp received', points, brushColor, brushRadius)

    ctx.drawing.lineJoin = "round"
    ctx.drawing.lineCap = "round"
    ctx.drawing.strokeStyle = brushColor

    ctx.temp.lineWidth = brushRadius * 2

    let p1 = points[0]
    let p2 = points[1]

    ctx.drawing.moveTo(p2.x, p2.y)
    ctx.drawing.beginPath()

    for (let i = 1, len = points.length; i < len; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point
        const midPoint = midPointBtw(p1, p2)
        ctx.drawing.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
        p1 = points[i]
        p2 = points[i + 1]
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.drawing.lineTo(p1.x, p1.y)
    ctx.drawing.stroke()
}
