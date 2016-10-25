import { IPortConfig } from "../../Config";
import { MakeblockApi } from "../api/MakeblockApi";
import { BotComponent, IBotComponent, Component } from "./component";
import { Camera } from "./Camera";

export default class Bot {
    private readonly _bot: MakeblockApi;
    private readonly _camera: Camera;
    private readonly _components: { [id: string]: IBotComponent | null };

    public get isInitialized(): boolean {
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
            let ctor = Component[key];
            let component: IBotComponent = new ctor(this._bot);

            this._components[key] = component;
        }
    }

    public shutdown(callback?: (err: Error) => void): boolean {
        this._camera.end();
        if (this._bot.isOpen) {
            this._bot.close(callback);
            return true;
        }

        return false;
    }
}
