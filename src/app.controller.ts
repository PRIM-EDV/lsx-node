import { Controller, Get, Post, Body } from '@nestjs/common';
import { WavPlayer } from './core/wav-player'
import { AppService } from './app.service';
import { WavChannel } from './core/wav-channel';

@Controller()
export class AppController {
  private _player: WavPlayer = new WavPlayer();

  private _droneActive: boolean = false;

  constructor(private _appService: AppService) {

  }

  @Get()
  public async Test() {
    let channel1 = new WavChannel();

    channel1.play('./src/wav/test.wav'
      ).then(() => {
        console.log('The wav file started to be played successfully.');
      }).catch((error) => {
        console.error(error);
      });
  }

  @Post()
  public async play(@Body() body: {file: string; channel: number; timestamp: number}) {
    const delay = body.timestamp - Date.now();

    if (delay <= 0) {
      this._appService.play('./src/wav/test.wav', 0);
    } else {
      setTimeout(() => {console.log(Date.now() - body.timestamp)}, delay);
    }
  }

  @Post('drone')
  public async playDrone(@Body() body: {status: string}) {
    let loop = null;
    let start = 0;
    const drone_loop_duration = 29902;
    const drone_intro_duration = 21895;
    const drone_outro_duration = 9682;

    if (!this._droneActive && body.status == 'start') {
      this._droneActive = true;
      this._player.play({path: './src/wav/drohne-anflug-v1.wav'})
      setTimeout(() => {
        start = Date.now()
        this._player.play({path: './src/wav/Drohne-mitte-loop.wav'})
      }, drone_intro_duration - 500)

      loop = setInterval(() => {
        this._player.play({path: './src/wav/Drohne-mitte-loop.wav'})
      }, drone_loop_duration - 500)
    } else if(this._droneActive && body.status == 'stop') {
      clearInterval(loop);
      setTimeout(() => {
        this._player.play({path: './src/wav/drohne-abflug.wav'})
        setTimeout(() => {this._droneActive = false;}, )
      }, drone_loop_duration - (Date.now() - start) - 500);
    }
  }
}