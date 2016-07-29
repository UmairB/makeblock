declare var System: any;
declare var Promise: any;
import * as io from 'socket.io-client';
import { IJoystickOptions } from './joystick/IJoystickOptions';
import { Joystick } from './joystick/Joystick';

interface IAppOptions {
    container: string,
    joystickSelector: string,
    sensorDistanceSelector: string,
    joystickOptions: IJoystickOptions
}

class App {
    private joystick: Joystick;
    private containerElement: Element;
    private socket: SocketIOClient.Socket;

    constructor(private options: IAppOptions) {
        this.containerElement = document.querySelector(options.container);

        this.initJoystick();
        this.initSockets();
    }

    private initJoystick() {
        let joystickElement = this.containerElement.querySelector(this.options.joystickSelector);

        this.joystick = new Joystick(joystickElement, this.options.joystickOptions);

        this.joystick.onMove((radialDistance, angle) => {
            this.socket.emit('joystick move', { radialDistance, angle });
        });

        this.joystick.onEnd(() => {
            this.socket.emit('joystick reset');
        });
    }

    private initSockets() {
        this.socket = io();

        // sensor distance
        let sensorDistanceElement = this.containerElement.querySelector(this.options.sensorDistanceSelector);
        this.socket.on('sensor distance', (value) => {
            sensorDistanceElement.innerHTML = value.distance;
        });
    }
}

Promise.all([
    System.import('/api/config'),
    System.import('nipplejs')
]).then((args) => {
    let config = args[0].config;

    new App({
        container: '.container',
        joystickSelector: '.joystick',
        sensorDistanceSelector: '.sensor-distance .distance',
        joystickOptions: <IJoystickOptions>config.joystick
    });
});
