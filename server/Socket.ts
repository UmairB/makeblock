/// <reference path='../typings/index.d.ts' />

import * as socket from 'socket.io';
import * as http from 'http';
import { Bot } from './Bot';
import { Config } from '../Config';

export class Socket {
    private io: SocketIO.Server;
    private bot: Bot;
    private sensorDistanceInterval;

    constructor(server: http.Server, bot: Bot) {
        this.io = socket(server);
        this.bot = bot;
    }

    initSockets() {
        this.io.on('connection', this.initEvents.bind(this));

        // setup the distance event emitter
        this.sensorDistanceInterval = setInterval(() => {
            this.io.emit('sensor distance', { distance: (Math.random() * 100).toFixed(2) + "cm" });
        }, Config.event.ultrasonicSensor.interval);
    }

    close() {
        this.io.close();
        if (this.sensorDistanceInterval) {
            clearInterval(this.sensorDistanceInterval);
        }
    }
    
    private initEvents(socket: SocketIO.Socket) {
        socket.on('disconnect', () => {
        });
    }
}
