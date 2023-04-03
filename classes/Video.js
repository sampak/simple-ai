import * as fs from 'fs';
// import ffmpeg from 'fluent-ffmpeg';
import ffmpeg from 'ffmpeg'
import CanvasClass from './canvas.js';

export default class Video {
  constructor(filePath) {
    this.filePath = filePath;
  }  

  test = async (Detector, fileName, frameIndex) => {

    const Canvas = new CanvasClass();
    const predictions = await Detector.detectFromImage(fileName);
    const image = await Canvas.loadImage(fileName);
    const canvas = await Canvas.draw(image, predictions);
    await Canvas.save(canvas, `output/${this.filePath}/input`, `${frameIndex}.png`);
  }


  async detect(Detector, Canvas) {
    return new Promise((resolve, reject) => {

      var process = new ffmpeg(this.filePath);

      process.then(async (video) => {

      if (!fs.existsSync(`output/${this.filePath}/output`)){
          fs.mkdirSync(`output/${this.filePath}/output`, { recursive: true });
      }

        // await video.fnExtractFrameToJPG(`output/${this.filePath}/output`, {
        //   frame_rate: 1,
        //   number: 50,
        //   keep_pixel_aspect_ratio : true,
        //   keep_aspect_ratio: true,
        //   file_name : '_%s'
        // }, (error, files) => {
        //   files.forEach(async (file, index) => await this.test(Detector, file, index))
        // });
      });


      console.log(`output/${this.filePath}/input/0.png`);
      try {

        var command = ffmpeg();
        

        command
        .input(`output/${this.filePath}/input/0.png`)
        .save("./test.mp4")
        .outputFPS(1)
        .frames(2)
        .on('end', () => {
          console.log("done");
        });
      }catch(e) {
        console.log(e);
      }
      

      // ffmpeg.ffprobe(this.filePath, async (error, metadata) => {
      //   if (error) {
      //     reject(error);
      //     return;
      //   }
        
      //   const fps = metadata.streams[0].avg_frame_rate.split('/')[0];
      //   let frameIndex = 0;
      //   const frameSize = 1920 * 1080 * 4; // Wielkość bufora dla jednej klatki wideo
      //   let buffer = Buffer.alloc(0);
        
      //   const video = await ffmpeg(this.filePath);

      //   video.

      //   console.log(video);


        // .outputFormat('rawvideo')
        // .pipe()
        // .on('data', async (chunk) => {
          
        //   buffer = Buffer.concat([buffer, chunk]);
          
        //   while (buffer.length >= frameSize) {
        //     const frameBuffer = buffer;
        //     buffer = Buffer.alloc(0);;
        //     // await fs.writeFileSync(`output/debug/test.png`, frameBuffer);
        //       this.test(Detector, frameBuffer, frameIndex)
         
              
        //     console.log(`frame index: ${frameIndex}`)
        //     frameIndex++;
        //   }  
          
        //   // const image = await Canvas.createImage(chunk);
        // })
        // .on('end', () => {
        //   resolve();
        // })
        // .on('error', (error) => {
        //   reject(error);
        // })
       
      // })
    })
  }
}