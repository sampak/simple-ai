

import { config } from "dotenv";
import CanvasClass from "./classes/canvas.js";
config()
import Detecting from "./classes/detecting.js";
import Video from "./classes/Video.js";


const fileName = 'cat.jpeg'
const saveFileName = 'cat-ai.jpeg'

let Detector = null;
let Canvas = new CanvasClass(1920, 1080);

let video = new Video(`test_data/cars.mp4`);

(async () => {
  console.log("Initialize AI");
  Detector = new Detecting();
  await Detector.init();
  console.log('AI Initialized');
  console.log('Detection objects');
  // video.detect(Detector, Canvas);
  const predictions = await Detector.detectFromImage(`test_data/${fileName}`);
  console.log("Objects detected creating image on canvas");
  const canvasImage = await Canvas.loadImage(`test_data/${fileName}`);
  console.log("Image loaded drawing on canvas");
  const canvas = await Canvas.draw(canvasImage, predictions);
  console.log("Image drawed saving to file");
  await Canvas.save(canvas, 'output', saveFileName);
})()