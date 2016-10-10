import { Camera } from "../bot/Camera";

let camera = new Camera();
camera.start();

let onExit = () => {
    camera.end();
};

process.on("exit", onExit);
