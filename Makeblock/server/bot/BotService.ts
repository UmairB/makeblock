import { Config } from '../../Config';
import { IJoystickValues, IMotorValues } from '../model/module';

const joystickConfig = Config.joystick;
const maxPowerValue = Config.bot.motor.maxPowerValue;

export class BotService {
    public CalculateMotorValues(value: IJoystickValues) : IMotorValues {
        let motorValues: IMotorValues = null;
        if (value !== null) {
            this.verifyCorrectValue(value);

            motorValues = { left: 0, right: 0 };

            let powerValue = (value.radialDistance / joystickConfig.radius) * maxPowerValue;

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

    private verifyCorrectValue(value: IJoystickValues) {
        if (value.radialDistance > joystickConfig.radius) {
            value.radialDistance = joystickConfig.radius;
        }

        if (value.angle >= 360) {
            value.angle =- 360;
        }
    }
}

/*
    DC Motors have values in the range 255 to -255
*/
