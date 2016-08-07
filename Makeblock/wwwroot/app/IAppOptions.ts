export interface IAppOptions {
    joystickOptions: IJoystickOptions
}

export interface IJoystickOptions {
    angleThreshold: number,
    angleMargin: number,
    radialThreshold: number,
    radius: number
}