import { IMotorConfig, IPortConfig } from '../../Config';
import { MakeblockApi } from '../api/MakeblockApi';
import { Camera } from "./Camera";
import { Slot } from "../model/Slot";

export enum BotComponent {
    UltrasonicSensor,
    Motor,
    Servo
}

export class Bot {
    private readonly _bot: MakeblockApi;
    private readonly _camera: Camera;
    private readonly _components: { [id: string]: IBotComponent | null };

    public get isInitialized() : boolean {
        return this._bot.isOpen;
    }

    constructor(config: IPortConfig, components: Array<BotComponent>) {
        this._bot = new MakeblockApi({ 
            port: config.port, 
            baudrate: config.baudrate,
            onPortError: (err) => console.log(err)
        });

        this._camera = new Camera();

        this._components = {};
        components.forEach(id => this._components[BotComponent[id]] = null);
    }

    public getComponent<T extends IBotComponent>(component: BotComponent) {
        return <T>this._components[BotComponent[component]];
    }

    public initialize(callback: (err: Error) => void) {
        this._bot.open(callback);
        this._camera.start();

        for (let key in this._components) {
            let ctor = eval(key);
            let component: IBotComponent = new ctor(this._bot);

            this._components[key] = component;
        }
    }

    public shutdown(callback?: (err: Error) => void) : boolean {
        this._camera.end();
        if (this._bot.isOpen) {
            this._bot.close(callback);
            return true;
        }

        return false;
    }
}

export interface IBotComponent {
    botComponent: BotComponent
}

export class UltrasonicSensor implements IBotComponent {
    private bot: MakeblockApi;

    public get botComponent() {
        return BotComponent.UltrasonicSensor;
    }

    constructor(bot: any) {
        this.bot = bot;
    }

    public read(port: number, onRead: (err: Error, value: number) => void) {
        this.bot.ultrasonicSensorRead(port, onRead);
    }
}

export class Motor implements IBotComponent {
    private bot: MakeblockApi;

    public get botComponent() {
        return BotComponent.Motor;
    }

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

export class Servo implements IBotComponent {
    private bot: MakeblockApi;

    public get botComponent() {
        return BotComponent.Servo;
    }

    constructor(bot: any) {
        this.bot = bot;
    }

    public run(port: number, slot: Slot, angle: number) {
        this.bot.servoRun(port, slot, angle);
    }
}
