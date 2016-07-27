/// <reference path='./typings/index.d.ts' />

import { Config } from './Config';
import { Server } from './server/Server';

let server = new Server();
server.start(Config.webServer.port);

process.on('exit', function () {
    console.log('terminating...'); 
    server.stop();
});
