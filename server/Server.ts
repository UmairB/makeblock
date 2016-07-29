import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Config, IClientConfig } from '../Config';
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

    public initRoutes() {
        app.use(express.static(path.resolve(__dirname,  `../${Config.webServer.root}`)));
        
        let apiRouter = express.Router();
        apiRouter.get('/config\.:ext?', function(req, res) {
            let clientConfig = <IClientConfig>{
                joystick: Config.joystick
            };

            if (req.params.ext === "js") {
                res.header("Content-Type", "application/javascript");
                res.send(`exports.config = ${JSON.stringify(clientConfig)};`);
            } else if (req.params.ext === "json" || !req.params.ext) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(clientConfig);
            } else {
                // HTTP status 404: NotFound
                res.status(404)
                   .send('Not found');
            }
        });

        app.use('/api', apiRouter);
    }

    public start(port: number, onStart: (address: string, port: number) => void = null) {
        server = app.listen(port, () => {
            if (onStart !== null) {
                var addr = server.address();
                onStart(addr.address, addr.port);
            }
        });

        socket = new Socket(server, bot);
        socket.initSockets();
    }

    public stop(onClose: () => void = null) {
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
        bot.motor.reset(Config.bot.motor);
    }
}
