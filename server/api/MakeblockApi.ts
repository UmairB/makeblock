import { SerialPort } from 'serialport';

export interface IMakeblockApiOptions {
    port: string,
    baudrate: number,
    onPortError?: (err) => void
}

export class MakeblockApi {
    private options: IMakeblockApiOptions;
    private dataParser: DataParser;
    private port: SerialPort;

    public get isOpen(): boolean {
        return this.port.isOpen;
    }

    constructor(options: IMakeblockApiOptions) {
        this.options = options;
        this.dataParser = new DataParser();
        this.port = new SerialPort(this.options.port, {
            baudRate: this.options.baudrate,
            autoOpen: false
        });
    }

    public open(callback: (err: Error) => void) {
        this.initEvents();

        this.port.open(function () {
            let err = <Error>arguments[0];
            callback(err);
        });;
    }

    public close(callback?: (err: Error) => void) {
        let close: any = this.port['close'].bind(this.port);
        close(callback);
    }

    public dcMotorRun(port: number, speed: number, callback?: (err: Error) => void) {
        let id = 0;
        let action = 2;
        let device = 0xa;
        let spd = Utils.getBytesFromShort(speed);

        this.write([id, action, device, port].concat(spd), callback)
    }

    public dcMotorStop(port: number, callback?: (err: Error) => void) {
        this.dcMotorRun(port, 0, callback);
    }

    public ultrasonicSensorRead(port: number, callback: (err: Error, value?: number) => void) {
        let action = 1;
        let device = 1;
        let id = ((port << 4) + device) & 0xff;

        if (this.write([id, action, device, port], callback)) {
            this.dataParser.setCallback(id, (data) => callback(null, data));
        }
    }

    private write(buffer: Array<number>, callback: (err: Error) => void) {
        if (this.port.isOpen) {
            var buf = new Buffer([0xff, 0x55, buffer.length + 1].concat(buffer).concat([0xa]));

            this.port.write(buf, (err, bytesWritten) => {
                if (err) {
                    callback(Error(err));
                }
            });

            return true;
        }

        return false;
    }

    private initEvents() {
        this.port.on('open', () => {
            this.port.on('data', this.dataParser.Parse.bind(this.dataParser));
            this.port.on('error', this.options.onPortError.bind(this.options));
        });
    }
}

class DataParser {
    private buffer: Array<number>;
    private isParseStart: boolean;
    private isParseStartIndex: number;
    private callbacks;

    constructor() {
        this.buffer = [];
        this.isParseStart = false;
        this.callbacks = {};
    }

    public Parse(data) {
        let readBuffer = new Uint8Array(data);
        for (let i = 0; i < readBuffer.length; i++) {
            this.buffer.push(readBuffer[i]);
            let len = this.buffer.length;
            if (len >= 2) {
                if (this.buffer[len - 1] == 0x55 && this.buffer[len - 2] == 0xff) {
                    this.isParseStart = true;
                    this.isParseStartIndex = len - 2;
                }

                if (this.buffer[len - 1] == 0xa && this.buffer[len - 2] == 0xd && this.isParseStart == true) {
                    this.isParseStart = false;
                    let position = this.isParseStartIndex + 2;
                    let extId = this.buffer[position];
                    position += 1;
                    let type = this.buffer[position];
                    let value = 0;
                    position += 1;//# 1 byte 2 float 3 short 4 len+string 5 double 6 long

                    switch (type) {
                        case 1:
                            {
                                value = this.buffer[position];
                            }
                            break;
                        case 2:
                            {
                                value = Utils.getFloatFromBytes([this.buffer[position], this.buffer[position + 1], this.buffer[position + 2], this.buffer[position + 3]]);
                            }
                            break;
                        case 3:
                            {
                                value = Utils.getShortFromBytes([this.buffer[position], this.buffer[position + 1]]);
                            }
                            break;
                        case 6:
                            {
                                value = Utils.getLongFromBytes([this.buffer[position], this.buffer[position + 1], this.buffer[position + 2], this.buffer[position + 3]]);
                            }
                            break;
                    }

                    if (type <= 6) {
                        this.responseValue(extId, value);
                    }

                    this.buffer = [];
                }
            }
        }
    }

    public setCallback(id: number, callback: (data: any) => void) {
        this.callbacks["callback_" + id] = callback;
    }

    private responseValue(id: number, value: any) {
        let cb = this.callbacks["callback_" + id];
        if (cb) {
            this.callbacks[id](value);
        }
    }
}

class Utils {
    public static getShortFromBytes(v) {
        var buf = new ArrayBuffer(2);
        var i = new Uint8Array(buf);
        i[0] = v[0];
        i[1] = v[1];
        var s = new Int16Array(buf);
        return s[0];
    }

    public static getFloatFromBytes(v) {
        var buf = new ArrayBuffer(4);
        var i = new Uint8Array(buf);
        i[0] = v[0];
        i[1] = v[1];
        i[2] = v[2];
        i[3] = v[3];
        var f = new Float32Array(buf);
        return f[0];
    }

    public static getLongFromBytes(v) {
        var buf = new ArrayBuffer(4);
        var i = new Uint8Array(buf);
        i[0] = v[0];
        i[1] = v[1];
        i[2] = v[2];
        i[3] = v[3];
        var l = new Int32Array(buf);
        return l[0];
    }

    public static getBytesFromShort(v) {
        var buf = new ArrayBuffer(2);
        var s = new Int16Array(buf);
        s[0] = v;
        var i = new Uint8Array(buf);
        return [i[0], i[1]];
    }

    public static getBytesFromFloat(v) {
        var buf = new ArrayBuffer(4);
        var f = new Float32Array(buf);
        f[0] = v;
        var i = new Uint8Array(buf);
        return [i[0], i[1], i[2], i[3]];
    }

    public static getBytesFromLong(v) {
        var buf = new ArrayBuffer(4);
        var l = new Int32Array(buf);
        l[0] = v;
        var i = new Uint8Array(buf);
        return [i[0], i[1], i[2], i[3]];
    }
}
