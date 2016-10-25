import UltrasonicSensor from "./UltrasonicSensor";
import Motor from "./Motor";
import Servo from "./Servo";
import EncoderMotor from "./EncoderMotor";

export * from "./BotComponent";
export * from "./IBotComponent";

export { UltrasonicSensor, Motor, EncoderMotor, Servo };

export const Component = {
    UltrasonicSensor: UltrasonicSensor,
    Motor: Motor,
    EncoderMotor: EncoderMotor,
    Servo: Servo
};
