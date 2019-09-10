import { WavPlayer } from "./wav-player";
import { BehaviorSubject } from "rxjs";

export class WavChannel {
    public static readonly READY = 1;
    public static readonly RUNNING = 0;

    private _player: WavPlayer = new WavPlayer();
    private _readyState: BehaviorSubject<number> = new BehaviorSubject<number>(WavChannel.READY);
    private _priority: number = -1;
    
    public async play(path: string, priority=0): Promise<void> {
        if (this.readyState == WavChannel.READY && priority > this._priority) {
            this.readyState = WavChannel.RUNNING;
            this._priority = priority;

            try {
                await this._player.play({path: path, sync: true})

                console.log('I"m done')
            } catch(err) {
                // throw err;
            }

            this._priority = -1;
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