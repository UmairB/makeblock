export interface IAppOptions {
    joystickOptions: {
        motor: IJoystickOptions;
        servo: IJoystickOptions;
    };
    camera: {
        port: number;
        query: string;
    };
}

export interface IJoystickOptions {
    radius: number;
    angleThreshold: number;
    angleMargin: number;
    radialThreshold: number;
}
