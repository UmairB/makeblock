export interface IConfig {
    webServer: IWebServerConfig,
    bot: IBotConfig,
    event: IEventConfig,
    joystick: IJoystickConfig
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

export interface IEventConfig {
    ultrasonicSensor: {
        interval: number
    }
}

export interface IJoystickConfig {
    radius: number,
    angleThreshold: number,
    radialThreshold: number
}

export interface IClientConfig {
    joystick: IJoystickConfig
}

//port: COM3,/dev/ttyUSB0
export const Config = <IConfig>{
    "webServer": {
        "port": 8000,
        "root": "wwwroot"
    },
    "bot": {
        "port": "COM3",
        "ultrasonicSensor": { port: 3 },
        "motor": {
            "left": { port: 9 },
            "right": { port: 10 }
        }
    },
    "event": {
        "ultrasonicSensor": {
            "interval": 1000
        }
    },
    "joystick": {
        "radius": 60,
        "angleThreshold": 15,
        "radialThreshold": 5
    }
};
