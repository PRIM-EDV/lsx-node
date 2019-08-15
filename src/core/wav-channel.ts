import { WavPlayer } from "./wav-player";
import { BehaviorSubject } from "rxjs";

export class WavChannel {
    public static readonly READY = 1;
    public static readonly RUNNING = 0;

    private _player: WavPlayer = new WavPlayer();
    private _readyState: BehaviorSubject<number> = new BehaviorSubject<number>(WavChannel.READY);
    
    public async play(path: string): Promise<void> {
        if (this.readyState == WavChannel.READY) {
            this.readyState = WavChannel.RUNNING;
        
            try {
                await this._player.play({path: path})
            } catch(err) {
                throw err;
            }

            this.readyState = WavChannel.READY;
        } else {
            throw new Error('Channel still in use');
        }
    }

    public set onReady(callback) {
        this._readyState.subscribe((readyState) => {
            if (readyState == WavChannel.READY) {
                callback();
            }
        })
    }

    public set onRunning(callback)  {
        this._readyState.subscribe((readyState) => {
            if (readyState == WavChannel.RUNNING) {
                callback();
            }
        })
    }

    public get readyState() {
        return this._readyState.value;
    }

    public set readyState(readyState: number) {
        this._readyState.next(readyState);
    }
}