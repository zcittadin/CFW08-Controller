import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { BleDevice } from '../models/ble-device.model';

@Injectable()
export class DeviceCommandService {
    arduino: BleDevice;
    private connectionStatus: boolean = false;
    private variables: number;

    constructor(private bluetoothService: BluetoothService) { }

    connectToDevice(): Promise<any> {
        return this.bluetoothService.scan().then((connected) => {
            this.arduino = this.getArduino();
            if (this.arduino) {
                console.log('Dispositivo disponível...');
                this.bluetoothService.connect(this.arduino.UUID)
                    .then((device) => {
                        console.log('Conectado com sucesso.')
                    });
            }
            return this.arduino;
        });
    }

    disconnectToDevice(): Promise<any> {
        return this.bluetoothService.disconnect(this.arduino.UUID)
            .then((device) => {
                if (device = null) {
                    this.arduino = null;
                }
                return this.arduino;
            });
    }

    isBluetoothEnabled(): Promise<boolean> {
        return this.bluetoothService.isBluetoothEnabled().then((enabled) => {
            return enabled;
        });
    }

    isConnected(): boolean {
        if (!this.arduino)
            return false;
        return true;
    }

    sendCommandOnOff(commandBit: boolean) {
        let command: string;
        if (commandBit)
            command = 'LIGAR';
        else
            command = 'DESLIGAR';
        let arr = this.convertToAsciiArray(command).map(param => {
            return this.convertToHexString(param);
        }).join(",");
        const updateMessage = this.getMessage(this.arduino.UUID, arr);
        this.bluetoothService.write(updateMessage);
    }

    sendCommandRotation(commandBit: boolean) {
        let command: string;
        if (commandBit)
            command = 'HHHHHHHH';
        else
            command = 'AHAHAHAH';
        let arr = this.convertToAsciiArray(command).map(param => {
            return this.convertToHexString(param);
        }).join(",");
        const updateMessage = this.getMessage(this.arduino.UUID, arr);
        this.bluetoothService.write(updateMessage);
    }

    sendValue(setPoint: number): boolean {
        if (!this.arduino) {
            return false;
        }
        let arr = this.convertToNumberArray(setPoint).map(param => {
            return this.convertToHexString(param);
        }).join(",");

        const updateMessage = this.getMessage(this.arduino.UUID, arr);
        this.bluetoothService.write(updateMessage);
        return true;
    }

    readValue(): boolean {
        const updateMessage = this.getMessageRead(this.arduino.UUID);
        this.connectionStatus = this.bluetoothService.notify(updateMessage);
        return this.connectionStatus;
    }

    getMessage(UUID: string, value: string): any {
        return {
            peripheralUUID: UUID,
            serviceUUID: 'ffe0',
            characteristicUUID: 'ffe1',
            value: value
        };
    }

    getMessageRead(UUID: string): any {
        return {
            peripheralUUID: UUID,
            serviceUUID: 'ffe0',
            characteristicUUID: 'ffe1',
            onNotify: function (result) {
                const data = new Uint8Array(result.value);
                this.variables = data;
            }.bind(this)
        };
    }

    getVariables(): number {
        return this.variables;
    }

    getArduino(): BleDevice {
        return this.bluetoothService.bleDevicesAround
            .filter(d => d.name && d.name.indexOf('ZANDER') > -1)[0];
    }

    convertToHexString(code: number): string {
        return "0x" + code.toString(16);
    }

    convertToNumberArray(val: number): number[] {
        let str: string = val.toString();
        let myValues: number[] = new Array();
        for (let i = 0; i < str.length; i++) {
            myValues.push(Number(str.charAt(i)));
        }
        return myValues;
    }

    convertToAsciiArray(command: string): number[] {
        let arr: number[] = new Array();
        for (let i = 0; i < command.length; i++) {
            arr.push(command.charCodeAt(i));
        }
        return arr;
    }

}