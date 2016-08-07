import * as socket from 'socket.io';
import * as http from 'http';
import { Config } from '../Config';
import { Bot, BotService, BotComponent, UltrasonicSensor, Motor, Servo } from './bot/module';
import { IJoystickValues, IMotorValues } from './model/module';

export class Socket {
    private io: SocketIO.Server;
    private bot: Bot;
    private botService: BotService;
    private sensorDistanceInterval: NodeJS.Timer;
    private currentClientId: string;

    constructor(server: http.Server, bot: Bot) {
        this.currentClientId = null;

        this.io = socket(server);
        this.bot = bot;

        this.botService = new BotService();
    }

    public initSockets() {
        this.io.on('connection', this.initEvents.bind(this));

        // setup the distance event emitter
        if (this.bot.isInitialized) {
            let sensor = this.bot.getComponent<UltrasonicSensor>(BotComponent.UltrasonicSensor);
            this.sensorDistanceInterval = setInterval(() => { 
                sensor.read(Config.bot.ultrasonicSensor.port, (err, distance) => {
                    if (typeof distance !== "undefined") {
                        this.io.emit('sensor distance', { distance: `${distance.toFixed(2)}cm` });
                    }
                });
            }, Config.event.ultrasonicSensor.interval);
        }
    }

    public close() {
        this.io.close();
        if (this.sensorDistanceInterval) {
            clearInterval(this.sensorDistanceInterval);
        }
    }

    private initEvents(socket: SocketIO.Socket) {
        this.checkUserConnection(socket);

        if (this.bot.isInitialized) {
            let motor = this.bot.getComponent<Motor>(BotComponent.Motor);
            socket.on('joystick move', (value: IJoystickValues) => {
                if (this.currentClientId === socket.client.id) {
                    let motorValues = this.botService.CalculateMotorValues(value);
                    if (motorValues) {
                        motor.run(Config.bot.motor.left.port, motorValues.left);
                        motor.run(Config.bot.motor.right.port, motorValues.right);
                    }
                }
            });

            socket.on('joystick reset', () => {
                if (this.currentClientId === socket.client.id) {
                    motor.reset(Config.bot.motor);
                }
            });
        }

        socket.on('joystick connection', this.checkUserConnection.bind(this, socket));

        let onUserDisconnectedCb: () => void = this.onUserDisconnected.bind(this, socket);

        socket.on('joystick disconnected', () => {
            onUserDisconnectedCb();
        });
        socket.on('disconnect', () => {
            onUserDisconnectedCb();
        });
    }

    private checkUserConnection(socket: SocketIO.Socket) {
        let connected = false;
        if (this.currentClientId === null) {
            this.currentClientId = socket.client.id;
            connected = true;

            this.io.emit('joystick connectable', false);
        }

        socket.emit('joystick connected', connected);
    }

    private onUserDisconnected(socket: SocketIO.Socket) {
        if (this.currentClientId === socket.client.id) {
            this.currentClientId = null;
            socket.emit('joystick connected', false);

            this.io.emit('joystick connectable', true);
        }
    }
}