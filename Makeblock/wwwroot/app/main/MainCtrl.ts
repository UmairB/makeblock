import * as angular from "angular";
import * as io from "socket.io-client";
import "../app";
import { IAppOptions, IJoystickOptions } from "../IAppOptions";
import { IJoystickApi } from "../joystick/Joystick";

enum connectionState {
    connected,
    disconnected
}

interface IViewModel {
    distance: string;
    joystick: IJoystick;
    checkingAvailability: boolean;
    joystickDisabled: boolean;
    connectionState: string;
    connectButton: IConnectButton;
}

interface IJoystick {
    motor: {
        options: IJoystickOptions;
        api: IJoystickApi;
    };
    servo: {
        options: IJoystickOptions;
        api: IJoystickApi;
    };
}

interface IConnectButton {
    text: string;
    disabled: boolean;
    click: () => void;
}

export class MainCtrl implements IViewModel {
    private socket: SocketIOClient.Socket;

    public distance: string;
    public joystick: IJoystick;
    public checkingAvailability: boolean;
    public joystickDisabled: boolean;
    public connectionState: string;
    public connectButton: IConnectButton;
    public cameraSrc: string;

    constructor(private $scope: angular.IScope, appOptions: IAppOptions) {
        this.checkingAvailability = true;
        this.joystickDisabled = false;
        this.connectButton = {
            text: "Connect",
            disabled: true,
            click: this.toggleJoystickConnection.bind(this)
        };
        this.cameraSrc = `http://${window.location.hostname}:${appOptions.camera.port}?${appOptions.camera.query}`;

        this.initSockets();
        this.initJoystick(appOptions);
    }

    private toggleJoystickConnection() {
        let event;
        if (this.connectionState === connectionState[connectionState.connected]) {
            event += "joystick disconnected";
        } else if (!this.connectButton.disabled) {
            event += "joystick connection";
        }

        if (event) {
            this.checkingAvailability = true;
            this.socket.emit(event);
        }
    }

    private initJoystick(appOptions: IAppOptions) {
        let api = (event: string) => {
            return {
                event: {
                    onMove: (radialDistance, angle) => {
                        this.socket.emit(`${event} move`, { radialDistance, angle });
                    },
                    onEnd: () => {
                        this.socket.emit(`${event} reset`);
                    }
                }
            };
        };

        this.joystick = {
            motor: {
                options: appOptions.joystickOptions.motor,
                api: api("motor")
            },
            servo: {
                options: appOptions.joystickOptions.servo,
                api: api("servo")
            }
        };
    }

    private initSockets() {
        this.socket = io();

        // sensor distance
        this.socket.on("sensor distance", (value) => {
            this.$scope.$applyAsync((s) => this.distance = value.distance);
        });

        this.socket.on("joystick connectable", (available: boolean) => {
            this.$scope.$applyAsync((s) => this.connectButton.disabled = !available);
        });

        this.socket.on("joystick connected", (connected: boolean) => {
            this.$scope.$applyAsync((s) => {
                this.checkingAvailability = false;
                this.joystickDisabled = !connected;
                this.connectionState = connectionState[connected ? connectionState.connected : connectionState.disconnected];
                this.connectButton.text = connected ? "Disconnect" : "Connect";
                if (connected) {
                    this.connectButton.disabled = false;
                }
            });
        });
    }
}

angular.module("app")
    .controller("mainCtrl", ["$scope", "appOptions", MainCtrl]);
