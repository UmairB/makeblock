import { injectable, inject } from "inversify";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import { Config } from "../Config";
import { Socket } from "./Socket";
import { Bot, BotComponent, Motor } from "./bot/module";
import { ILogger, LOGGER_TYPES } from "./log/Logger";

@injectable()
export class Server {
    private readonly logger: ILogger;
    private readonly app: express.Express;
    private server: http.Server;
    private socket: Socket;
    private bot: Bot;

    constructor(@inject(LOGGER_TYPES.Logger) logger: ILogger) {
        this.logger = logger;

        this.app = express();
    }

    public initRoutes() {
        this.app.use(express.static(path.resolve(__dirname, `../${Config.webServer.root}`)));

        let apiRouter = express.Router();
        apiRouter.get("/config\.:ext?", function (req, res) {
            let clientConfig = Config.client;

            if (req.params.ext === "js") {
                res.header("Content-Type", "application/javascript");
                res.send(`exports.config = ${JSON.stringify(clientConfig)};`);
            } else if (req.params.ext === "json" || !req.params.ext) {
                res.header("Content-Type", "application/json; charset=utf-8");
                res.send(clientConfig);
            } else {
                // HTTP status 404: NotFound
                res.status(404)
                    .send("Not found");
            }
        });

        this.app.use("/api", apiRouter);
    }

    public start(port: number, onStart: ((address: string, port: number) => void) | null = null, onError: ((err: Error) => void) | null = null) {
        this.bot = new Bot(Config.bot, [BotComponent.UltrasonicSensor, BotComponent.Motor, BotComponent.Servo]);
        this.bot.initialize((err: Error) => {
            if (err) {
                this.logger.exception(err, "Error initializing bot");

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

    public stop(onClose: (() => void) | null = null) {
        this.bot.shutdown(this.logger.exception.bind(this.logger));

        if (!this.server) {
            if (onClose !== null) { onClose(); }
            return;
        }

        this.server.close(() => {
            if (onClose !== null) { onClose(); }

            this.socket.close();
            this.server.destroy();
        });
    }

    private initServer(port: number, onStart: ((address: string, port: number) => void) | null = null) {
        this.server = this.app.listen(port, () => {
            if (onStart !== null) {
                let addr = this.server.address();
                onStart(addr.address, addr.port);
            }
        });

        this.socket = new Socket(this.server, this.bot);
        this.socket.initSockets();
    }

    private onBotInit() {
        this.bot.getComponent<Motor>(BotComponent.Motor).reset(Config.bot.motor);
    }
}
