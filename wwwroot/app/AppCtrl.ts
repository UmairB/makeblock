import * as angular from 'angular';
import * as io from 'socket.io-client';
import './app';
import { IJoystickApi } from './joystick/Joystick';

export interface IAppModel {
    distance: string,
    joystickApi: IJoystickApi
}

export class AppCtrl implements IAppModel {
    private socket: SocketIOClient.Socket;

    public distance: string;
    public joystickApi: IJoystickApi;

    constructor(private $scope: angular.IScope) {
        this.initJoystick();
        this.initSockets();
    }

    private initJoystick() {
        this.joystickApi = {
            event: {
                onMove: (radialDistance, angle) => {
                    this.socket.emit('joystick move', { radialDistance, angle });
                },
                onEnd: () => {
                    this.socket.emit('joystick reset');
                }
            }
        }
    }

    private initSockets() {
        this.socket = io();

        // sensor distance
        this.socket.on('sensor distance', (value) => {
            this.$scope.$applyAsync((s) => this.distance = value.distance);
        });
    }
}

angular.module('app')
    .controller('appCtrl', ['$scope', AppCtrl]);
