/// <reference path="./typings/index.d.ts" />
import kernel from "./inversify.config";
import { Config } from "./Config";
import { Server } from "./server/Server";
import { logger } from "./server/log/Logger";
import { Serialport } from "./server/Serialport";

let args = process.argv.slice(2);
if (args[0] === "port-list") {
    // just list the usb ports
    Serialport.list((err, ports) => {
        if (ports) {
            ports.forEach(p => {
                console.log(`port: ${JSON.stringify(p)}`);
            });
        }
    });
} else {
    let environment = <string>process.env.NODE_ENV;
    let isProduction = environment && environment.trim() === "production";

    let server = kernel.get(Server);
    server.initRoutes();

    server.start(Config.webServer.port, (address, port) => {
        logger.info(`server listening at ${address}":"${port}`);

        if (!isProduction) {
            // open the documentation page (hopefully in a browser)
            let open = require("open");
            open(`http://localhost:${port}`);
        }
    });

    let onExit = () => {
        server.stop(() => {
            logger.info("Turning off server");
        });
    };

    process.on("exit", onExit);

    // //catches ctrl+c event
    // process.on("SIGINT", onExit);

    // //catches uncaught exceptions
    // process.on("uncaughtException", onExit);
}
