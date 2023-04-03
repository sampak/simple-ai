// * TensorFlow Stuff
import * as tf from "@tensorflow/tfjs-node";
import coco_ssd from "@tensorflow-models/coco-ssd";
import * as fs from 'fs';
import sharp from 'sharp';

export default class Detecting {

  constructor() {
    this.model = null;
  }

  async init() {
    try {
      this.model = await coco_ssd.load({
        base: "mobilenet_v1"
      })
      
      return true;
    } catch(e) {
      console.error(e);
      return false;
    }
  }

  async open(path) {
    return await fs.readFileSync(path);
  }

  async detectFromBuffer(frameBuffer) {

    const pngBuffer = await sharp(frameBuffer, {
      raw: {
        width: 1920, // width of frame
        height: 1080, // height of frame
        channels: 4, // rgba
      },
    })
      .png()
      .toBuffer();

    let tensor = tf.node.decodeImage(pngBuffer, 1000, 'int32', 'rgba')
    tensor = tensor.slice([0, 0, 0], [-1, -1, 3]);
    const predictions = await this.model.detect(tensor, 100, 0.25);
    return predictions;
  }

  async detectFromImage(file) {
    const frameBuffer = await fs.readFileSync(file);
    const pngBuffer = await sharp(frameBuffer).png().toBuffer();
    const tensor = tf.node.decodeImage(pngBuffer)
    const predictions = await this.model.detect(tensor, 100, 0.25);
    
    return predictions;
  }

}