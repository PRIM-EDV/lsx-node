import { Controller, Get } from '@nestjs/common';
import { WavPlayer } from './core/wav-player'

@Controller()
export class AppController {
  constructor() {

  }

  @Get()
  public async Test() {
    let channel1 = new WavPlayer();

    channel1.play({
        path: './src/wav/test2.wav',
      }).then(() => {
        console.log('The wav file started to be played successfully.');
      }).catch((error) => {
        console.error(error);
      });
  }
}