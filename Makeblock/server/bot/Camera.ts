import * as fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { logger } from '../log/Logger';

let IMAGE_PATH = '/tmp/stream',
    IMAGE_NAME = 'pic.jpg';

export class Camera {
    private cameraProcess: ChildProcess;
    private streamingProcess: ChildProcess;

    public start() {
        try {
            if (!fs.existsSync(IMAGE_PATH)) {
                fs.mkdirSync(IMAGE_PATH);
            }
        } catch (e) {
            logger.exception(e);
            return;
        }

        if (!this.cameraProcess) {
            let fullPath = `${IMAGE_PATH}/${IMAGE_NAME}`;
            this.cameraProcess = spawn('raspistill', [
                '-rot', '0',
                '-w', '640',
                '-h', '480',
                '-q', '5',
                '-o', fullPath,
                '-tl', '100',
                '-t', '9999999',
                '-th', '0:0:0'
            ]);

            this.cameraProcess.on('exit', () => {
                console.log('camera process has stopped');
                this.cameraProcess = null;
            });
        }

        if (!this.streamingProcess) {
            this.streamingProcess = spawn('mjpg_streamer', [
                '-i', `/usr/local/lib/input_file.so -f ${IMAGE_PATH} -n ${IMAGE_NAME}`,
                '-o', '/usr/local/lib/output_http.so -w /usr/local/www'
            ]);

            this.streamingProcess.on('exit', () => {
                console.log('streaming process has stopped');
                this.streamingProcess = null;
            });
        }
    }

    public end() {
        if (this.cameraProcess) {
            this.cameraProcess.kill();
        }

        if (this.streamingProcess) {
            this.streamingProcess.kill();
        }
    }
}
