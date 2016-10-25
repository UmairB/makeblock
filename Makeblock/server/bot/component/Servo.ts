import { MakeblockApi } from "../../api/MakeblockApi";
import { BotComponent } from "./BotComponent";
import { IBotComponent } from "./IBotComponent";
import { Slot } from "../../model/Slot";

export default class Servo implements IBotComponent {
    private bot: MakeblockApi;

    public get botComponent() {
        return BotComponent.Servo;
    }

    constructor(bot: MakeblockApi) {
        this.bot = bot;
    }

    public run(port: number, slot: Slot, angle: number) {
        this.bot.servoRun(port, slot, angle);
    }
}