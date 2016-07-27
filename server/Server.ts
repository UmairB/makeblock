import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Config } from '../Config';
import { Bot } from './Bot';

let app: express.Express;
let server: http.Server;
let bot: Bot;

export class Server {
    constructor() {
        app = express();
        bot = new Bot(Config.bot.port, this.onBotInit);
    }

    initRoutes() {
        app.use(express.static(path.resolve(__dirname, '../www')));
    }

    start(port: number) {
        server = app.listen(port, () => {
            var addr = server.address();
            console.log(`server listening at ${addr.address}":"${addr.port}`);
        });
    }

    stop() {
        server.close(() => {
            console.log('Turning off server');

            server.destroy();

            server = undefined;
            app = undefined;
        });
    }
    
    private onBotInit() {
        bot.motor.stop(Config.bot.motor.left.port);
        bot.motor.stop(Config.bot.motor.right.port);
    }
}
