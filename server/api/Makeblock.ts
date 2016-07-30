import * as serialport from 'serialport';

export interface IMakeblockOptions {
    port: string,
    baudrate: number
}

export class Makeblock {
    private _isOpen: boolean;
    private _options: IMakeblockOptions;
    private _port: serialport.SerialPort;

    public get isOpen() {
        return this._isOpen;
    }

    constructor(options: IMakeblockOptions) {
        this._options = options;
    }
}
