import { BotService } from "./BotService";
import { IJoystickValues } from "../model";
import { Config } from "../../Config";

let motorConfig = Config.client.joystick.motor;

describe("BotService spec", () => {
    let botService = new BotService();

    describe("CalculateMotorValues should", () => {
        it("return null", () => {
            let result = botService.CalculateMotorValues(null);
            expect(result).toBeNull();
        });

        it("calculate values for east movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 0
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(Config.bot.motor.maxPowerValue);
            expect(result!.right).toBe(-Config.bot.motor.maxPowerValue);
        });

        it("calculate values for north-east movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 45
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(Config.bot.motor.maxPowerValue);
            expect(result!.right).toBe(Config.bot.motor.maxPowerValue / 2);
        });

        it("calculate values for north movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 90
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(Config.bot.motor.maxPowerValue);
            expect(result!.right).toBe(Config.bot.motor.maxPowerValue);
        });

        it("calculate values for north-west movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 135
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(Config.bot.motor.maxPowerValue / 2);
            expect(result!.right).toBe(Config.bot.motor.maxPowerValue);
        });

        it("calculate values for west movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 180
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(-Config.bot.motor.maxPowerValue);
            expect(result!.right).toBe(Config.bot.motor.maxPowerValue);
        });

        it("calculate values for south-west movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 225
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(-Config.bot.motor.maxPowerValue / 2);
            expect(result!.right).toBe(-Config.bot.motor.maxPowerValue);
        });

        it("calculate values for south movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 270
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(-Config.bot.motor.maxPowerValue);
            expect(result!.right).toBe(-Config.bot.motor.maxPowerValue);
        });

        it("calculate values for south-east movement", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius,
                angle: 315
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(-Config.bot.motor.maxPowerValue);
            expect(result!.right).toBe(-Config.bot.motor.maxPowerValue / 2);
        });

        it("calculate max power percentage", () => {
            let values = <IJoystickValues>{
                radialDistance: motorConfig.radius / 2,
                angle: 90
            };

            let result = botService.CalculateMotorValues(values);

            expect(result).not.toBeNull();
            expect(result!.left).toBe(Config.bot.motor.maxPowerValue / 2);
            expect(result!.right).toBe(Config.bot.motor.maxPowerValue / 2);
        });
    });
});
