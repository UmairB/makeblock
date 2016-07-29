import { IMotorConfig } from '../Config';
let MegaPi = require("megapi").MegaPi;

export class Bot {
    private bot: any;
    private _motor: Motor;
    private _ultrasonicSensor: UltrasonicSensor;

    public get motor() : Motor {
        return this._motor;
    }

    public get ultrasonicSensor() : UltrasonicSensor {
        return this._ultrasonicSensor;
    }

    constructor(port: string, onStart: () => void) {
        this.bot = new MegaPi(port, onStart);

        this._motor = new Motor(this.bot);
        this._ultrasonicSensor = new UltrasonicSensor(this.bot);
    }
}

class UltrasonicSensor {
    private bot: any;

    constructor(bot: any) {
        this.bot = bot;
    }

    public read(port: number, onRead: (value: number) => void) {
        this.bot.ultrasonicSensorRead(port, onRead);
    }
}

class Motor {
    private bot: any;

    constructor(bot: any) {
        this.bot = bot;
    }

    public stop(port: number) {
        this.bot.dcMotorStop(port);
    }

    public run(port: number, speed: number) {
        this.bot.dcMotorRun(port, speed);
    }

    public reset(motorConfig: IMotorConfig) {
        this.stop(motorConfig.left.port);
        this.stop(motorConfig.right.port);
    }
}
