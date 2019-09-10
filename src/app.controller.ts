import { Controller, Get, Post, Body } from '@nestjs/common';
import { WavPlayer } from './core/wav-player'
import { StreamPlayer } from './core/stream-player'
import { AppService } from './app.service';
import { WavChannel } from './core/wav-channel';

@Controller()
export class AppController {
  private _player: WavPlayer = new WavPlayer();
  private _streamer: StreamPlayer = new StreamPlayer();

  private _droneActive: boolean = false;
  private _droneStart: number = 0;
  private _droneLoop = null;

  private _streamActive = false;

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

  @Post('live') 
  public async playLive(@Body() body: {status: string}) {
    if(body.status == 'start' && !this._streamActive) {
      this._streamActive = true;
      await this._streamer.play();
    }

    if(body.status == 'stop' && this._streamActive) {
      await this._streamer.stop();
      this._streamActive = false;
    }
  }

  @Post('drone')
  public async playDrone(@Body() body: {status: string}) {
    const drone_loop_duration = 29902;
    const drone_intro_duration = 21895;
    const drone_outro_duration = 9682;

    if (!this._droneActive && body.status == 'start') {
      this._droneActive = true;
      this._player.play({path: './src/wav/drohne-anflug-v1.wav'})

      setTimeout(() => {
        this._droneStart = Date.now()
        this._player.play({path: './src/wav/Drohne-mitte-loop.wav'})

        if (this._droneActive){
          this._droneLoop = setInterval(() => {
            if (this._droneActive){
              this._droneStart = Date.now();
              this._player.play({path: './src/wav/Drohne-mitte-loop.wav'})
            }
          }, drone_loop_duration - 410)
        }
      }, drone_intro_duration - 410)

    } else if(this._droneActive && body.status == 'stop') {
      clearInterval(this._droneLoop);
      this._droneActive = false;
      setTimeout(() => {
        this._player.play({path: './src/wav/drohne-abflug.wav'})
        setTimeout(() => {this._droneActive = false;}, )
      }, drone_loop_duration - (Date.now() - this._droneStart) - 410);
    }
  }
}