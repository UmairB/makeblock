import * as angular from 'angular';
import * as io from 'socket.io-client';
import './app';
import { IJoystickApi } from './joystick/Joystick';

enum connectionState {
    connected,
    disconnected
}

interface IAppModel {
    distance: string,
    joystickApi: IJoystickApi,
    checkingAvailability: boolean,
    joystickDisabled: boolean,
    connectionState: string,
    connectButton: IConnectButton
}

interface IConnectButton {
    text: string,
    click: () => void
}

export class AppCtrl implements IAppModel {
    private socket: SocketIOClient.Socket;

    public distance: string;
    public joystickApi: IJoystickApi;
    public checkingAvailability: boolean;
    public joystickDisabled: boolean;
    public connectionState: string;
    public connectButton: IConnectButton;

    constructor(private $scope: angular.IScope) {
        this.checkingAvailability = true;
        this.joystickDisabled = false;
        this.connectButton = {
            text: 'Connect',
            click: this.toggleJoystickConnection.bind(this)
        };

        this.initSockets();
        this.initJoystick();
    }

    private toggleJoystickConnection() {
        debugger;
        let event = 'joystick ';
        if (this.connectionState === connectionState[connectionState.connected]) {
            event += 'disconnected';
        } else {
            event += 'connection';
        }

        this.checkingAvailability = true;
        this.socket.emit(event);
    }

    private initJoystick() {
        this.joystickApi = {
            event: {
                onMove: (radialDistance, angle) => {
                    debugger;
                    this.socket.emit('joystick move', { radialDistance, angle });
                },
                onEnd: () => {
                    debugger;
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

        this.socket.on('joystick connected', (connected: boolean) => {
            this.$scope.$applyAsync((s) => {
                this.checkingAvailability = false;
                this.joystickDisabled = !connected;
                this.connectionState = connectionState[connected ? connectionState.connected : connectionState.disconnected];
                this.connectButton.text = connected ? 'Disconnect' : 'Connect';
            });
        });
    }
}

angular.module('app')
    .controller('appCtrl', ['$scope', AppCtrl]);
