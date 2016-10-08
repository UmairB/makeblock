import { Camera } from "../bot/Camera";

var camera = new Camera();
camera.start();

let onExit = () => {
    camera.end();
};

process.on('exit', onExit);
