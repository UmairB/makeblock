/// <reference path='./typings/index.d.ts' />

import { Config } from './Config';
import { Server } from './server/Server';

let server = new Server();
server.initRoutes();

server.start(Config.webServer.port, (address, port) => {
    console.log(`server listening at ${address}":"${port}`);

    // open the documentation page (hopefully in a browser)
    let open = require('open');
    open(`http://localhost:${port}`);
});

process.on('exit', function () { 
    server.stop(() => {
        console.log('Turning off server');
    });
});
