/// <reference path='../typings/index.d.ts' />

import * as socket from 'socket.io';
import * as http from 'http';
import { Bot } from './Bot';

export class Socket {
    private io: SocketIO.Server;
    private bot: Bot;

    constructor(server: http.Server, bot: Bot) {
        this.io = socket(server);
        this.bot = bot;
    }

    initSockets() {
        this.io.on('connection', this.initEvents.bind(this));
    }

    close() {
        this.io.close();
    }
    
    private initEvents(socket: SocketIO.Socket) {
        socket.on('connect', () => { });
        socket.on('disconnect', () => { });
    }
}
