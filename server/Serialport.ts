import { list, portConfig } from 'serialport';

export class Serialport {
    public static list(callback: (err: string, ports: IPort[]) => void) {
        list((err, portConfigs) => {
            if (err) {
                callback(err, null);
            } else {
                let ports = portConfigs.map(p => {
                    return {
                        comName: p.comName,
                        manufacturer: p.manufacturer,
                        serialNumber: p.serialNumber,
                        pnpId: p.pnpId,
                        locationId: p.locationId,
                        vendorId: p.vendorId,
                        productId: p.productId
                    };
                });

                callback(null, ports);
            }
        });
    }
}

export interface IPort {
    comName: string;
    manufacturer: string;
    serialNumber: string;
    pnpId: string;
    locationId: string;
    vendorId: string;
    productId: string;
}
