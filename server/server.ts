import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

export class Server {
    private app: express.Express;
    private server: http.Server;

    constructor() {
        this.app = express();
    }

    initRoutes() {
        this.app.use(express.static(path.resolve(__dirname, '../www')));
    }

    start(port: number) {
        this.server = this.app.listen(port, () => {
            var addr = this.server.address();
            console.log(`server listening at ${addr.address}":"${addr.port}`);
        });
    }

    stop() {
        this.server.close();
        this.server.destroy();
    }
}
