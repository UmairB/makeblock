export interface IConfig {
    botRequired: boolean,
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
    baudrate: number,
    ultrasonicSensor: IUltrasonicSensorConfig,
    motor: IMotorConfig
}

export interface IUltrasonicSensorConfig {
    port: number
}

export interface IMotorConfig {
    maxPowerValue: number,
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
    angleMargin: number,
    radialThreshold: number
}

export interface IClientConfig {
    joystick: IJoystickConfig
}

//port: COM3,/dev/ttyUSB0
export const Config = <IConfig>{
    "botRequired": false,
    "webServer": {
        "port": 8000,
        "root": "wwwroot"
    },
    "bot": {
        "port": "COM4",
        "baudrate": 115200,
        "ultrasonicSensor": { port: 3 },
        "motor": {
            "maxPowerValue": 255, 
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
        "angleThreshold": 45,
        "angleMargin": 20,
        "radialThreshold": 5
    }
};
