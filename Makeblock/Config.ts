export interface IConfig {
    botRequired: boolean,
    webServer: IWebServerConfig,
    bot: IBotConfig,
    joystick: IJoystickConfig
}

export interface IWebServerConfig {
    port: number,
    root: string
}

export interface IPortConfig {
    port: string,
    baudrate: number
}

export interface IBotConfig extends IPortConfig {
    port: string,
    baudrate: number,
    motor: IMotorConfig,
    ultrasonicSensor?: IUltrasonicSensorConfig,
    servo?: IServoConfig
}

export interface IUltrasonicSensorConfig {
    port: number,
    refreshInterval: number
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

export interface IServoConfig {
    port: number,
    slot: number
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
        "motor": {
            "maxPowerValue": 255, 
            "left": { port: 9 },
            "right": { port: 10 }
        },
        "ultrasonicSensor": { 
            port: 3,
            refreshInterval: 1000 
        },
        "servo": {
            port: 1,
            slot: 1
        }
    },
    "joystick": {
        "radius": 60,
        "angleThreshold": 45,
        "angleMargin": 20,
        "radialThreshold": 5
    }
};
