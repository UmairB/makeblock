export interface IConfig {
    webServer: IWebServerConfig,
    bot: IBotConfig
}

export interface IWebServerConfig {
    port: number,
    root: string
}

export interface IBotConfig {
    port: string,
    ultrasonicSensor: IUltrasonicSensorConfig,
    motor: IMotorConfig
}

export interface IUltrasonicSensorConfig {
    port: number
}

export interface IMotorConfig {
    left: {
        port: number
    },
    right: {
        port: number
    }
}

//port: COM3,/dev/ttyUSB0
export const Config = <IConfig>{
    "webServer": {
        "port": 8000,
        "root": "wwwroot"
    },
    "bot": {
        "port": "COM3",
        "ultrasonicSensor": { port:3 },
        "motor": {
            "left": { port: 9 },
            "right": { port: 10 }
        }
    }
};
