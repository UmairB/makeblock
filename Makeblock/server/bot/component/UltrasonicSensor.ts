import { MakeblockApi } from "../../api/MakeblockApi";
import { BotComponent } from "./BotComponent";
import { IBotComponent } from "./IBotComponent";

export default class UltrasonicSensor implements IBotComponent {
    private bot: MakeblockApi;

    public get botComponent() {
        return BotComponent.UltrasonicSensor;
    }

    constructor(bot: MakeblockApi) {
        this.bot = bot;
    }

    public read(port: number, onRead: (err: Error, value: number) => void) {
        this.bot.ultrasonicSensorRead(port, onRead);
    }
}
