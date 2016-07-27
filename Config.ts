interface Config {
    webServer: {
        port: number
    },
    bot: {
        port: string,
        ultrasonicSensor: {
            port: number
        },
        motor: {
            left: {
                port: number
            },
            right: {
                port: number
            }
        }
    }
}

//port: COM3,/dev/ttyUSB0
export const Config = <Config>{
    "webServer": {
        "port": 8000 
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
