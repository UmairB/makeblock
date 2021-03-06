import "reflect-metadata";
import { Kernel } from "inversify";
import { BotService, IBotService, BOTSERVICE_TYPES } from "./server/bot/BotService";
import { Logger, ILogger, LOGGER_TYPES } from "./server/log/Logger";
import { SocketFactory, ISocketFactory, SOCKET_TYPES } from "./server/Socket";
import { Server } from "./server/Server";

let kernel = new Kernel();
kernel.bind<IBotService>(BOTSERVICE_TYPES.BotService)
      .to(BotService)
      .inSingletonScope();

kernel.bind<ILogger>(LOGGER_TYPES.Logger)
      .to(Logger)
      .inSingletonScope();

kernel.bind<ISocketFactory>(SOCKET_TYPES.SocketFactory)
      .to(SocketFactory)
      .inSingletonScope();

kernel.bind<Server>(Server)
      .toSelf();

export default kernel;
