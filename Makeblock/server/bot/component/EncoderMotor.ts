import { MakeblockApi } from "../../api/MakeblockApi";
import { BotComponent } from "./BotComponent";
import { IBotComponent } from "./IBotComponent";
import { IMotor } from "./IMotor";
import { Slot } from "../../model/Slot";

export default class EncoderMotor implements IBotComponent, IMotor {
    private bot: MakeblockApi;

    public get botComponent() {
        return BotComponent.EncoderMotor;
    }

    constructor(bot: MakeblockApi) {
        this.bot = bot;
    }

    public stop(port: number) {
        this.bot.dcMotorStop(port);
    }

    public run(slot: Slot, speed: number) {
        this.bot.encoderMotorRun(slot, speed);
    }
}
