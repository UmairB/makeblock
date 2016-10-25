import { Slot } from "../../model/Slot";

export interface IMotor {
    run: (portOrSlot: number | Slot, speed: number) => void;
}
