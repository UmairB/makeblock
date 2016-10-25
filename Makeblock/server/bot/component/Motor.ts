import { MakeblockApi } from "../../api/MakeblockApi";
import { BotComponent } from "./BotComponent";
import { IBotComponent } from "./IBotComponent";
import { IMotor } from "./IMotor";

export default class Motor implements IBotComponent, IMotor {
    private readonly bot: MakeblockApi;

    public get botComponent() {
        return BotComponent.Motor;
    }

    constructor(bot: MakeblockApi) {
        this.bot = bot;
    }

    public stop(port: number) {
        this.bot.dcMotorStop(port);
    }

    public run(port: number, speed: number) {
        this.bot.dcMotorRun(port, speed);
    }
}
