import { ChildProcess, spawn } from 'child_process';

export class StreamPlayer {
    private _proc = null;
    private _webstreamURL = 'http://192.168.178.26:8080'

    public async play(){
        console.log('play')
        this._proc = spawn('mpg123', [this._webstreamURL]);
    };
    public stop(){
        if (this._proc) {
            this._proc.kill();
            this._proc = null;
        }
    };
}