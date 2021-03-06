import { injectable, inject } from "inversify";
import * as socket from "socket.io";
import * as http from "http";
import { Config } from "../Config";
import { Bot, IBotService, BOTSERVICE_TYPES, BotComponent, UltrasonicSensor, Motor, Servo } from "./bot";
import { IJoystickValues, Slot } from "./model";

export interface ISocketFactory {
    create: (server: http.Server, bot: Bot) => Socket;
}

@injectable()
export class SocketFactory implements ISocketFactory {
    constructor(@inject(BOTSERVICE_TYPES.BotService) private botService: IBotService) {
    }

    public create(server: http.Server, bot: Bot): Socket {
        let io = socket(server);
        return new Socket(io, bot, this.botService);
    }
}

export class Socket {
    private io: SocketIO.Server;
    private bot: Bot;
    private botService: IBotService;
    private sensorDistanceInterval: NodeJS.Timer;
    private currentClientId: string | null;

    constructor(io: SocketIO.Server, bot: Bot, botService: IBotService) {
        this.currentClientId = null;

        this.io = io;
        this.bot = bot;
        this.botService = botService;
    }

    public initSockets() {
        this.io.on("connection", this.initEvents.bind(this));

        // setup the distance event emitter
        if (this.bot.isInitialized && Config.bot.ultrasonicSensor) {
            let sensor = this.bot.getComponent<UltrasonicSensor>(BotComponent.UltrasonicSensor);
            this.sensorDistanceInterval = setInterval(() => {
                sensor.read(Config.bot.ultrasonicSensor.port, (err, distance) => {
                    if (typeof distance !== "undefined") {
                        this.io.emit("sensor distance", { distance: `${distance.toFixed(2)}cm` });
                    }
                });
            }, Config.bot.ultrasonicSensor.refreshInterval);
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
            socket.on("motor move", (value: IJoystickValues) => {
                if (this.currentClientId === socket.client.id) {
                    let motorValues = this.botService.CalculateMotorValues(value);
                    if (motorValues) {
                        motor.run(Config.bot.motor.left.port, motorValues.left);
                        motor.run(Config.bot.motor.right.port, motorValues.right);
                    }
                }
            });

            socket.on("motor reset", () => {
                if (this.currentClientId === socket.client.id) {
                    this.botService.ResetMotors(this.bot);
                }
            });

            let servo = this.bot.getComponent<Servo>(BotComponent.Servo);
            socket.on("servo move", (value: IJoystickValues) => {
                if (this.currentClientId === socket.client.id) {
                    let servoValues = this.botService.CaculateServoValues(value);
                    if (servoValues) {
                        let portOne = servoValues[Slot.One];
                        if (typeof portOne === "number") {
                            servo.run(Config.bot.servo.port, Slot.One, portOne);
                        }
                    }
                }
            });

            socket.on("servo reset", () => {
                if (this.currentClientId === socket.client.id) {
                    let servoValues = this.botService.ResetServos();
                    let portOne = servoValues[Slot.One];
                    servo.run(Config.bot.servo.port, Slot.One, portOne);
                }
            });
        }

        socket.on("joystick connection", this.checkUserConnection.bind(this, socket));

        let onUserDisconnectedCb: () => void = this.onUserDisconnected.bind(this, socket);

        socket.on("joystick disconnected", onUserDisconnectedCb);
        socket.on("disconnect", onUserDisconnectedCb);
    }

    private checkUserConnection(socket: SocketIO.Socket) {
        let connected = false;
        if (this.currentClientId === null) {
            this.currentClientId = socket.client.id;
            connected = true;

            this.io.emit("joystick connectable", false);
        }

        socket.emit("joystick connected", connected);
    }

    private onUserDisconnected(socket: SocketIO.Socket) {
        if (this.currentClientId === socket.client.id) {
            this.currentClientId = null;
            socket.emit("joystick connected", false);

            this.io.emit("joystick connectable", true);
        }
    }
}

export const SOCKET_TYPES = {
    SocketFactory: Symbol("SocketFactory")
};
