export interface IConfig {
    botRequired: boolean;
    webServer: IWebServerConfig;
    bot: IBotConfig;
    client: IClientConfig;
}

export interface IWebServerConfig {
    port: number;
    root: string;
}

export interface IPortConfig {
    port: string;
    baudrate: number;
}

export interface IBotConfig extends IPortConfig {
    port: string;
    baudrate: number;
    ultrasonicSensor: IUltrasonicSensorConfig;
    servo: IServoConfig;
    motor: IMotorConfig;
}

export interface IUltrasonicSensorConfig {
    port: number;
    refreshInterval: number;
}

export interface IServoConfig {
    port: number;
    slot: {
        [slot: number]: IServoSlotConfig;
    };
}

export interface IServoSlotConfig {
    neutral: number;
    minValue: number;
    maxValue: number;
}

export interface IMotorConfig {
    maxPowerValue: number;
    left: {
        port: number;
    };
    right: {
        port: number;
    };
}

export interface IJoystickConfig {
    radius: number;
    angleThreshold: number;
    angleMargin: number;
    radialThreshold: number;
}

export interface IClientConfig {
    joystick: {
        motor: IJoystickConfig;
        servo: IJoystickConfig;
    };
}

//port: COM3,/dev/ttyUSB0
export const Config = <IConfig>{
    "botRequired": false,
    "webServer": {
        "port": 8000,
        "root": "wwwroot"
    },
    "bot": {
        "port": "COM3",
        "baudrate": 115200,
        "ultrasonicSensor": { 
            port: 4,
            refreshInterval: 1000 
        },
        "servo": { 
            port: 3,
            slot: {
                1: {
                    neutral: 67,
                    minValue: 10,
                    maxValue: 130
                } 
            }
         },
        "motor": {
            "maxPowerValue": 255, 
            "left": { port: 9 },
            "right": { port: 10 }
        }
    },
    "client": {
        "joystick": {
            "motor": {
                "radius": 60,
                "angleThreshold": 45,
                "angleMargin": 20,
                "radialThreshold": 5
            },
            "servo": {
                "radius": 60,
                "angleThreshold": 90,
                "angleMargin": 45,
                "radialThreshold": 10
            }
        }
    }
};
