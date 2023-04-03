
import { createCanvas, Image, loadImage  } from 'canvas';
import * as fs from 'fs';
import sharp from 'sharp';

export default class CanvasClass {
  constructor(width = 1920, height = 1080) {
    this.width = width;
    this.height = height;
    this.canvas = createCanvas(width, height)
    this.context = this.canvas.getContext('2d')
  }

  async clean() {
    this.context.clearRect(0, 0, this.width, this.height);
  }


  async draw(image, predictions) {
    this.context.drawImage(image, 0, 0, this.width, this.height)

    await predictions.forEach(prediction => {

      this.context.strokeStyle = 'red';
      this.context.strokeRect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3])
    })

    return this.canvas;
  }

  async save(canvas, path, fileName) {

    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
  }

    const imgBuffer = canvas.toBuffer('image/png')
    fs.writeFileSync(`${path}/${fileName}`, imgBuffer)
  }

  async loadImage(path) {
    return new Promise((resolve) => {
       loadImage(path).then(async (data) => {
        resolve(data);
      });
    })
  }

  async createImage(frameBuffer) {
    const pngBuffer = await sharp(frameBuffer, {
      raw: {
        width: 1920, // width of frame
        height: 1080, // height of framr
        channels: 4, // rgba
      },
    }).png().toBuffer();

    await fs.writeFileSync(`output/debug/test.png`, pngBuffer);
    const img = new Image();
    img.src = pngBuffer;

    return img;
  }
}

