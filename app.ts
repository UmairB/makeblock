/// <reference path='./typings/index.d.ts' />
import { Config } from './Config';
import { Server } from './server/Server';
import { logger } from './server/log/Logger';
import { Serialport } from './server/Serialport';

let args = process.argv.slice(2);
if (args[0] === "port-list") {
    // just list the usb ports
    Serialport.list((err, ports) => {
        ports.forEach(p => {
            console.log(`port: ${JSON.stringify(p)}`);
        });
    });
} else {
    let server = new Server();
    server.initRoutes();

    server.start(Config.webServer.port, (address, port) => {
        logger.info(`server listening at ${address}":"${port}`);

        // open the documentation page (hopefully in a browser)
        let open = require('open');
        open(`http://localhost:${port}`);
    });

    process.on('exit', function () { 
        server.stop(() => {
            logger.info('Turning off server');
        });
    });
}
