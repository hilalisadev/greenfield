'use strict'
// import Avc from '../broadway/Decoder'
import Size from '../utils/Size'
import YUVWebGLCanvas from '../canvas/YUVWebGLCanvas'

export default class AvcPlayer {
  static create (canvas, width, height) {
    const colorConversionCanvas = new YUVWebGLCanvas(canvas, new Size(width, height))
    // this.avc.onPictureDecoded = colorConversionCanvas.decode.bind(colorConversionCanvas)

    canvas.width = width
    canvas.height = height

    const worker = new window.Worker('Decoder.js')
    worker.addEventListener('message', function (e) {
      const data = e.data
      if (data.consoleLog) {
        console.log(data.consoleLog)
        return
      }

      colorConversionCanvas.decode(new Uint8Array(data.buf, 0, data.length), data.width, data.height, data.infos)
    }, false)
    worker.postMessage({
      type: 'Broadway.js - Worker init',
      options: {
        rgb: false
      }
    })

    return new AvcPlayer(canvas, worker)
  }

  constructor (canvas, worker) {
    this.canvas = canvas
    this._worker = worker

    // AVC codec initialization
    // this.avc = new Avc()
  }

  decode (data, parInfo) {
    // let naltype = 'invalid frame'
    //
    // if (data.length > 4) {
    //   if (data[4] === 0x65) {
    //     naltype = 'I frame'
    //   } else if (data[4] === 0x41) {
    //     naltype = 'P frame'
    //   } else if (data[4] === 0x67) {
    //     naltype = 'SPS'
    //   } else if (data[4] === 0x68) {
    //     naltype = 'PPS'
    //   }
    // }
    // console.log('Passed ' + naltype + ' to decoder')
    // this.avc.decode(data)
    this._worker.postMessage({
      buf: data.buffer,
      offset: data.byteOffset,
      length: data.length,
      info: parInfo
    }, [data.buffer])
  }
}
