/// <reference path='../typings/index.d.ts' />

import * as socket from 'socket.io';
import * as http from 'http';
import { Config } from '../Config';
import { Bot } from './Bot';
import { BotService } from './BotService';
import { IJoystickValues, IMotorValues } from './model/module';

export class Socket {
    private io: SocketIO.Server;
    private bot: Bot;
    private botService: BotService;
    private sensorDistanceInterval: NodeJS.Timer;
    private currentClientId: string;

    constructor(server: http.Server, bot: Bot) {
        this.io = socket(server);
        this.bot = bot;

        this.botService = new BotService();
    }

    public initSockets() {
        this.io.on('connection', this.initEvents.bind(this));

        // setup the distance event emitter
        this.sensorDistanceInterval = setInterval(() => {
            this.io.emit('sensor distance', { distance: (Math.random() * 100).toFixed(2) + "cm" });
        }, Config.event.ultrasonicSensor.interval);
    }

    public close() {
        this.io.close();
        if (this.sensorDistanceInterval) {
            clearInterval(this.sensorDistanceInterval);
        }
    }
    
    private initEvents(socket: SocketIO.Socket) {
        if (!this.currentClientId) {
            this.currentClientId = socket.client.id;
        }

        socket.on('joystick move', (value: IJoystickValues) => {
            if (this.currentClientId === socket.client.id) {
                let motorValues = this.botService.CalculateMotorValues(value, Config.joystick);
                this.bot.motor.run(Config.bot.motor.left.port, motorValues.left);
                this.bot.motor.run(Config.bot.motor.right.port, motorValues.right);
            }
        });

        socket.on('joystick reset', () => {
            if (this.currentClientId === socket.client.id) {
                this.bot.motor.reset(Config.bot.motor); 
            }
        });

        socket.on('disconnect', () => {
            this.currentClientId = null;
        });
    }
}
