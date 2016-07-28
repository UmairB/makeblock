declare var nipplejs: any;

export class JoystickService {
    public init(joystickElement: Element) {
        let joystick = nipplejs.create({
            zone: joystickElement,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'red'
        });

        return joystick;
    }

    public onMove(joystick, onMove: () => void) {
        joystick.on('move', (data) => {
            console.log(data);
        });
    }
}
