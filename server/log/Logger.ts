import * as winston from 'winston';

export class Logger {
    private logger: winston.LoggerInstance;

    constructor() {
        this.logger = new winston.Logger({
            transports: [
                new winston.transports.File({
                    filename: './logs/app.log',
                    handleExceptions: true,
                    humanReadableUnhandledException: true
                }),
                new winston.transports.Console({
                    level: 'error',
                    handleExceptions: true,
                    humanReadableUnhandledException: true,
                    colorize: true
                })
            ],
            exitOnError: false
        });
    }

    public info(msg: string) {
        this.logger.info(msg);
    }

    public warn(msg: string) {
        this.logger.warn(msg);
    }

    public error(msg: string) {
        this.logger.error(msg);
    }
}

export let logger = new Logger();
