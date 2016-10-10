import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";
require("winston-daily-rotate-file"); // set up so that DailyRotateFile is available on winston.transports

// make sure log folder exists
let logFolder = "./logs";
try {
    fs.mkdirSync(logFolder);
}
catch (e) {
    if (e.code !== "EEXIST") {
        throw e;
    }
}

export class Logger {
    private logger: winston.LoggerInstance;

    constructor() {
        this.logger = new winston.Logger({
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: path.join(logFolder, "app.log"),
                    datePattern: ".yyyy-MM-dd",
                    handleExceptions: true,
                    humanReadableUnhandledException: true,
                    json: false
                }),
                new winston.transports.Console({
                    level: "error",
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

    public exception(error: Error, msg?: string) {
        let errorMsg = winston.exception.getAllInfo(error);
        msg = msg || "An error occurred";

        this.logger.error(msg, errorMsg);
    }
}

export let logger = new Logger();
