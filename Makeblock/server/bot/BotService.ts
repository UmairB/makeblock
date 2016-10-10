import { Config } from "../../Config";
import { IJoystickValues, IMotorValues, IServoValues, Slot } from "../model/module";

const joystickConfig = Config.client.joystick;
const maxPowerValue = Config.bot.motor.maxPowerValue;

export class BotService {
    public CalculateMotorValues(value: IJoystickValues | null): IMotorValues | null {
        let motorValues: IMotorValues | null = null;
        if (value !== null) {
            this.verifyCorrectValue(value);

            motorValues = { left: 0, right: 0 };

            let powerValue = (value.radialDistance / joystickConfig.motor.radius) * maxPowerValue;

            if (value.angle === 0) {
                motorValues.left = powerValue;
                motorValues.right = -powerValue;
            } else if (0 < value.angle && value.angle <= 90) {
                motorValues.left = powerValue;
                motorValues.right = powerValue * (value.angle / 90);
            } else if (90 < value.angle && value.angle < 180) {
                let angleAdjustment = value.angle - 90;
                motorValues.left = powerValue * (angleAdjustment / 90);
                motorValues.right = powerValue;
            } else if (value.angle === 180) {
                motorValues.left = -powerValue;
                motorValues.right = powerValue;
            } else if (180 < value.angle && value.angle <= 270) {
                let angleAdjustment = value.angle - 180;
                motorValues.left = -powerValue * (angleAdjustment / 90);
                motorValues.right = -powerValue;
            } else if (270 < value.angle && value.angle < 360) {
                let angleAdjustment = value.angle - 270;
                motorValues.left = -powerValue;
                motorValues.right = -powerValue * (angleAdjustment / 90);
            }
        }

        return motorValues;
    }

    public CaculateServoValues(value: IJoystickValues | null): IServoValues | null {
        let servoValues: IServoValues | null = null;
        if (value != null && (value.angle === 0 || value.angle === 180)) {
            let slotOneConfig = Config.bot.servo.slot[Slot.One];
            let radialRatio = value.radialDistance / joystickConfig.servo.radius;
            let angle;

            if (value.angle === 0) {
                angle = slotOneConfig.neutral - (radialRatio * (slotOneConfig.neutral - slotOneConfig.minValue));
            } else {
                angle = slotOneConfig.neutral + (radialRatio * (slotOneConfig.maxValue - slotOneConfig.neutral));
            }

            servoValues = {};
            servoValues[Slot.One] = angle;
        }

        return servoValues;
    }

    public ResetServos(): IServoValues {
        let servoValues: IServoValues = {};
        servoValues[Slot.One] = Config.bot.servo.slot[Slot.One].neutral;

        return servoValues;
    }

    private verifyCorrectValue(value: IJoystickValues) {
        if (value.radialDistance > joystickConfig.motor.radius) {
            value.radialDistance = joystickConfig.motor.radius;
        }

        if (value.angle >= 360) {
            value.angle -= 360;
        }
    }
}

/*
    DC Motors have values in the range 255 to -255
    Servo has range of values 0 to 180
*/
