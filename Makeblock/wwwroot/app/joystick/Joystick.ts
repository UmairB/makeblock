declare var nipplejs: any;
import { IJoystickOptions } from '../IAppOptions';

export interface IJoystickApi {
    event: {
        onMove: (radialDistance, angle) => void,
        onEnd: () => void
    }
}

export class Joystick {
    private joystick;

    constructor(private options: IJoystickOptions, private api: IJoystickApi, private joystickElement: HTMLElement) {
        this.initJoystick();
    }

    private initJoystick() {
        this.joystick = nipplejs.create({
            zone: this.joystickElement,
            size: this.options.radius * 2,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'red'
        });

        // set up events
        if (this.api.event) {
            this.onMove();
            this.onEnd();
        }
    }

    private onEnd() {
        this.joystick.on('end', this.api.event.onEnd.bind(this.api.event));
    }

    private onMove() {
        let radialThreshold = this.options.radialThreshold;

        let currentValue = { angle: 0, distance: 0 };
        this.joystick.on('move', (obj, data) => {
            let angle = data.angle.degree,
                radialDistance = data.distance;

            let tAngle = this.calculateAngle(angle);
            let tDis = Math.floor(radialDistance / radialThreshold) * radialThreshold;

            if (typeof tAngle === "number" && (currentValue.angle !== tAngle || currentValue.distance !== tDis)) {
                currentValue.angle = tAngle;
                currentValue.distance = tDis;

                this.api.event.onMove(currentValue.distance, currentValue.angle);
            }
        });
    }

    private calculateAngle(angle: number) : number {
        let angleThreshold = this.options.angleThreshold;
        if (360 % angleThreshold === 0) {
            angleThreshold = 0;
        }

        // first check margins
        while (angleThreshold <= 360) {
            let diff = angle - angleThreshold;
            if (Math.abs(diff) <= this.options.angleMargin) {
                return angleThreshold === 360 ? 0 : angleThreshold;
            }

            angleThreshold += this.options.angleThreshold;
        }

        // // else just use the threshold
        // angleThreshold = this.options.angleThreshold;
        // return Math.floor(angle / angleThreshold) * angleThreshold;
    }
}
