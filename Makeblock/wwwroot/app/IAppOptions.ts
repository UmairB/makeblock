export interface IAppOptions {
    joystickOptions: {
        motor: IJoystickOptions;
        servo: IJoystickOptions;
    };
}

export interface IJoystickOptions {
    radius: number;
    angleThreshold: number;
    angleMargin: number;
    radialThreshold: number;
}
