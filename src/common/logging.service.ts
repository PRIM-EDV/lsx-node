import { Injectable } from '@nestjs/common';
import { TransformableInfo } from 'logform';
import * as Winston from 'winston';


const logFormat = Winston.format.printf((info: TransformableInfo) => {
    return `${info.timestamp} [${info.level}] ${info.message}`;
});

@Injectable()
export class LoggingService {
    private _logger: Winston.Logger;

    constructor() {
        console.log('instantiated')
        this._logger = Winston.createLogger({
            transports: [
                new Winston.transports.Console({
                    format: Winston.format.combine(
                        Winston.format(info => {
                            info.level = info.level.toUpperCase()
                            return info;
                        })(),
                        Winston.format.colorize(),
                        Winston.format.timestamp({
                            format: 'HH:mm:ss'
                        }),
                        logFormat
                    )
                }),
                new Winston.transports.File({
                    filename: 'logs/error.log', level: 'error',
                    format: Winston.format.combine(
                        Winston.format(info => {
                            info.level = info.level.toUpperCase()
                            return info;
                        })(),
                        Winston.format.timestamp({
                            format: 'HH:mm:ss'
                        }),
                        logFormat
                    )
                }),
                new Winston.transports.File({
                    filename: 'logs/log.log', level: 'debug',
                    format: Winston.format.combine(
                        Winston.format(info => {
                            info.level = info.level.toUpperCase()
                            return info;
                        })(),
                        Winston.format.timestamp({
                            format: 'HH:mm:ss'
                        }),
                        logFormat
                    )
                }),
            ],
        });  
    }

    public info(msg: string) {
        this._logger.info(msg);
    }

    public debug(msg: string) {
        this._logger.debug(msg)
    }

    public error(msg: string) {
        this._logger.error(msg)
    }
}