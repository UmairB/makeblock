import { IMotorConfig, IBotConfig } from '../../Config';
import { MakeblockApi } from '../api/MakeblockApi';

export enum Slot {
    One = 1,
    Two = 2
}

export class Bot {
    private bot: MakeblockApi;
    private _motor: Motor;
    private _ultrasonicSensor: UltrasonicSensor;
    private _servo: Servo;

    public get isInitialized() : boolean {
        return this.bot.isOpen;
    }

    public get motor() : Motor {
        return this._motor;
    }

    public get ultrasonicSensor() : UltrasonicSensor {
        return this._ultrasonicSensor;
    }

    public get servo() : Servo {
        return this._servo;
    }

    constructor(config: IBotConfig) {
        this.bot = new MakeblockApi({ 
            port: config.port, 
            baudrate: config.baudrate,
            onPortError: (err) => console.log(err)
        });
    }

    public initialize(callback: (err: Error) => void) {
        this.bot.open(callback);

        this._motor = new Motor(this.bot);
        this._ultrasonicSensor = new UltrasonicSensor(this.bot);
        this._servo = new Servo(this.bot);
    }

    public shutdown(callback?: (err: Error) => void) : boolean {
        if (this.bot.isOpen) {
            this.bot.close(callback);
            return true;
        }

        return false;
    }
}

class UltrasonicSensor {
    private bot: MakeblockApi;

    constructor(bot: any) {
        this.bot = bot;
    }

    public read(port: number, onRead: (err: Error, value: number) => void) {
        this.bot.ultrasonicSensorRead(port, onRead);
    }
}

class Motor {
    private bot: MakeblockApi;

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

class Servo {
    private bot: MakeblockApi;

    constructor(bot: any) {
        this.bot = bot;
    }

    public run(port: number, slot: Slot, angle: number) {
        this.bot.servoRun(port, slot, angle);
    }
}
