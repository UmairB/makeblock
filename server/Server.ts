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
        app.use(express.static(path.resolve(__dirname,  `../${Config.webServer.root}`)));
    }

    initSockets() {
        if (socket) {
            socket.initSockets();
        }
    }

    start(port: number, onStart: (address: string, port: number) => void = null) {
        server = app.listen(port, () => {
            if (onStart !== null) {
                var addr = server.address();
                onStart(addr.address, addr.port);
            }
        });

        socket = new Socket(server, bot);
    }

    stop(onClose: () => void = null) {
        server.close(() => {
            if (onClose !== null) {
                onClose();
            }

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
