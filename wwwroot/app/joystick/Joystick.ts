declare var nipplejs: any;
import { IJoystickOptions } from './IJoystickOptions';

export class Joystick {
    private joystick;

    constructor(private joystickElement: Element, private options: IJoystickOptions) {
        this.init();
    }

    public onEnd(onEnd: () => void) {
        this.joystick.on('end', () => onEnd());
    }

    public onMove(onMove: (radialDistance, angle) => void) {
        let angleThreshold = this.options.angleThreshold,
            angleThresholdRad = angleThreshold * (Math.PI / 180),
            radialThreshold = this.options.radialThreshold;

        let currentValue = { angle: 0, distance: 0 };
        this.joystick.on('move', (obj, data) => {
            let angle = data.angle.radian,
                radialDistance = data.distance;

            let tAngle = Math.floor(angle / angleThresholdRad) * angleThresholdRad;
            let tDis = Math.floor(radialDistance / radialThreshold) * radialThreshold;

            if (currentValue.angle !== tAngle || currentValue.distance !== tDis) {
                currentValue.angle = tAngle;
                currentValue.distance = tDis;

                onMove(currentValue.distance, currentValue.angle);
            }
        });
    }

    private init() {
        this.joystick = nipplejs.create({
            zone: this.joystickElement,
            size: this.options.radius * 2,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'red'
        });
    }
}
