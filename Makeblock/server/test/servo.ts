import { Bot, BotComponent, Servo, BotService } from "../bot";
import { Slot, IJoystickValues } from "../model";
import { Config } from "../../Config";

let botService = new BotService();
let bot: Bot | undefined = undefined;

let running = true;
while (running) {
    if (!bot) {
        console.log("running");
        bot = new Bot(Config.bot, [BotComponent.Servo]);
        bot.initialize((err) => {
            console.log("initialized", err);

            let servo = bot!.getComponent<Servo>(BotComponent.Servo);

            let value: IJoystickValues = {
                radialDistance: 0,
                angle: 0
            };

            let servoValues = botService.CaculateServoValues(value);
            if (servoValues) {
                let portOne = servoValues[Slot.One];
                if (typeof portOne === "number") {
                    servo.run(Config.bot.servo.port, Slot.One, portOne);
                }
            }

            running = false;
        });
    }
}
