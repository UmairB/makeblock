import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Config, IClientConfig } from '../Config';
import { Socket } from './Socket';
import { Bot, BotComponent, Motor } from './bot/Bot';
import { logger } from './log/Logger';

let app: express.Express;
let server: http.Server;
let socket: Socket;
let bot: Bot;

export class Server {
    constructor() {
        app = express();
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

    public start(port: number, onStart: (address: string, port: number) => void = null, onError: (err: Error) => void = null) {
        bot = new Bot(Config.bot, [BotComponent.UltrasonicSensor, BotComponent.Motor, BotComponent.Servo]);
        bot.initialize((err: Error) => {
            if (err) {
                logger.exception(err, 'Error initializing bot');

                if (onError !== null) {
                    onError(err);
                }

                if (Config.botRequired) {
                    return;
                }
            } else {
                this.onBotInit();
            }

            this.initServer(port, onStart);
        });
    }

    public stop(onClose: () => void = null) {
        bot.shutdown(logger.exception.bind(logger));

        if (!server) {
            onClose();
            return;
        }

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

    private initServer(port: number, onStart: (address: string, port: number) => void = null) {
        server = app.listen(port, () => {
            if (onStart !== null) {
                var addr = server.address();
                onStart(addr.address, addr.port);
            }
        });

        socket = new Socket(server, bot);
        socket.initSockets();
    }

    private onBotInit() {
        bot.getComponent<Motor>(BotComponent.Motor).reset(Config.bot.motor);
    }
}
