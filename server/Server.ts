import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Config } from '../Config';
import { Socket } from './Socket';
import { Bot } from './Bot';

let app: express.Express;
let server: http.Server;
let socket: Socket;
let bot: Bot;

export class Server {
    constructor() {
        app = express();
        bot = new Bot(Config.bot.port, this.onBotInit);
    }

    initRoutes() {
        app.use(express.static(path.resolve(__dirname, '../www')));
    }

    initSockets() {
        if (socket) {
            socket.initSockets();
        }
    }

    start(port: number) {
        server = app.listen(port, () => {
            var addr = server.address();
            console.log(`server listening at ${addr.address}":"${addr.port}`);
        });

        socket = new Socket(server, bot);
    }

    stop() {
        server.close(() => {
            console.log('Turning off server');

            socket.close();
            server.destroy();

            server = undefined;
            app = undefined;
            socket = undefined;
            bot = undefined;
        });
    }

    private onBotInit() {
        bot.reset(Config.bot.motor);
    }
}
