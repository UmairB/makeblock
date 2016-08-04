declare var System: any;
import * as io from 'socket.io-client';
import { IJoystickOptions } from './joystick/IJoystickOptions';
import { Joystick } from './joystick/Joystick';
import * as angular from 'angular';

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

System.import('config')
    .then((config) => {
        let joystickOptions = <IJoystickOptions>config.joystick;
        joystickOptions.hideOnInit = true;

        new App({
            container: '.container',
            joystickSelector: '.joystick',
            sensorDistanceSelector: '.sensor-distance .distance',
            joystickOptions: joystickOptions
        });
    });

module app {
    angular.module('app', []);
}

angular.element('document').ready(() => {
    angular.bootstrap('document', ['app']);
});
