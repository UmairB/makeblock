import { IJoystickConfig } from '../Config';
import { IJoystickValues, IMotorValues } from './model/module';

export class BotService {
    public CalculateMotorValues(value: IJoystickValues, joystickConfig: IJoystickConfig) : IMotorValues {
        return null;
    }
}

/*
    DC Motors have values in the range 255 to -255
*/
