declare var System: any;

import { IJoystickOptions } from './joystick/IJoystickOptions';
import { JoystickService } from './joystick/JoystickService';

interface IAppOptions {
    container: string,
    joystickSelector: string,
    joystickOptions: IJoystickOptions
}

class App {
    private joystickService: JoystickService;
    private containerElement: Element;

    constructor(private options: IAppOptions) {
        this.containerElement = document.querySelector(options.container);

        this.joystickService = new JoystickService();
        this.initJoystick();
    }

    private initJoystick() {
        let joystickElement = this.containerElement.querySelector(this.options.joystickSelector);
        let joystick = this.joystickService.init(joystickElement);

        this.joystickService.onMove(joystick, () => {
        });
    }
}

System.import('nipplejs').then(() => {
    new App({
        container: '.container',
        joystickSelector: '.joystick',
        joystickOptions: {}
    });
});
