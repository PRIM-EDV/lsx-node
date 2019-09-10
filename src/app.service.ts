import { Injectable } from "@nestjs/common";
import { WavPlayer } from "./core/wav-player";
import { WavChannel } from "./core/wav-channel";

const NUMBER_OF_CHANNELS = 16

@Injectable()
export class AppService {
    private _channels: Array<WavChannel> = [];

    constructor(){
        for (let i = 0; i < NUMBER_OF_CHANNELS; i++) {
            this._channels.push(new WavChannel());
        }
    };

    public async play(file: string, channel: number) {
        await this._channels[channel].play(file);
    }
}