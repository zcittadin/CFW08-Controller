import { Component, AfterViewInit, ElementRef, ViewChild, ViewContainerRef } from "@angular/core";
import { setInterval, clearTimeout } from "timer";

import { Switch } from "ui/switch";

import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { ModalComponent } from "../modal/app.modal";

import { Button } from "ui/button";
import { Color } from "color";

import { DeviceCommandService } from '../../services/device-command.service';
import { BluetoothService } from '../../services/bluetooth.service';

@Component({
    selector: "Inverter",
    moduleId: module.id,
    templateUrl: "inverter.component.html",
    styleUrls: ["inverter.css"]
})
export class InverterComponent implements AfterViewInit {

    scanRate;
    dataRead: any;
    frequencyTX: number;
    frequencyRX: number = 0;
    currentRX: number = 0;
    voltageRX: number = 0;
    private checkConnection: number = 0;
    private isConnected: boolean = false;
    private btnConnect: any;
    private switchMotor: any;
    private switchSentido: any;
    private toConnectColor = new Color("#0044FF");
    private connectedColor = new Color("#004D40");
    private isConnectingColor = new Color("#FFD600");

    @ViewChild("btnConnect") btnConnectRef: ElementRef;
    @ViewChild("switchMotor") switchMotorRef: ElementRef;
    @ViewChild("switchSentido") switchSentidoRef: ElementRef;

    constructor(private deviceCommandService: DeviceCommandService,
        private bluetoothService: BluetoothService,
        private modal: ModalDialogService, private vcRef: ViewContainerRef) { }

    ngAfterViewInit() {
        this.btnConnect = <Button>this.btnConnectRef.nativeElement;
        this.switchMotor = <Switch>this.switchMotorRef.nativeElement;
        this.switchSentido = <Switch>this.switchSentidoRef.nativeElement;
    }

    swMotorLoaded(args) {
        var switchv: Switch = <Switch>args.object;
        switchv.android.setTextOff("DESLIGADO");
        switchv.android.setTextOn("LIGADO");
    }

    swSentidoLoaded(args) {
        var switchv: Switch = <Switch>args.object;
        switchv.android.setTextOff("HORÁRIO");
        switchv.android.setTextOn("ANTI-HORÁRIO");
    }

    public toggleConnection() {
        this.deviceCommandService.isBluetoothEnabled().then((enabled) => {
            if (enabled) {
                if (!this.isConnected) {
                    this.btnConnect.text = "Conectando...";
                    this.btnConnect.backgroundColor = this.isConnectingColor;
                    this.connect();
                }
                else {
                    this.btnConnect.text = "Desconectando...";
                    this.btnConnect.backgroundColor = this.isConnectingColor;
                    this.disconnect();
                }
            } else {
                TNSFancyAlert.showWarning("Atenção", "Bluetooth desablilitado.", "Voltar");
                this.btnConnect.text = "Conectar";
                this.btnConnect.backgroundColor = this.toConnectColor;
            }
        });
    }

    public changeFrquency() {
        let options = {
            context: {},
            fullscreen: true,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(ModalComponent, options).then(res => {
            this.frequencyTX = res;
            this.send();
        });
    }

    public send() {
        if (!this.isConnected) {
            TNSFancyAlert.showWarning("Atenção", "Desconectado do dispositivo.", "Voltar");
            this.frequencyTX = null;
            return;
        }
        else {
            if (this.frequencyTX != null)
                this.deviceCommandService.sendValue(this.frequencyTX);
        }
    }

    public toggleMotor() {
        if (!this.isConnected) {
            TNSFancyAlert.showWarning("Atenção", "Desconectado do dispositivo.", "Voltar");
            return;
        } else {
            this.deviceCommandService.sendCommandOnOff(this.switchMotor.checked);
        }
    }

    public toggleSentido() {
        if (!this.isConnected) {
            TNSFancyAlert.showWarning("Atenção", "Desconectado do dispositivo.", "Voltar");
            return;
        } else {
            this.deviceCommandService.sendCommandRotation(this.switchSentido.checked);
        }
    }

    private connect() {
        this.deviceCommandService.connectToDevice().then((device) => {
            if (device == null) {
                this.btnConnect.text = "Conectar";
                this.btnConnect.backgroundColor = this.toConnectColor;
                TNSFancyAlert.showWarning("Atenção", "Dispositivo não encontrado", "Voltar");
                this.isConnected = false;
                return;
            }
            this.btnConnect.text = "Conectado";
            this.btnConnect.backgroundColor = this.connectedColor;
            this.isConnected = true;
            this.scanRate = setInterval(() => {
                if (this.deviceCommandService.readValue()) {
                    this.checkConnection = 0;
                    this.dataRead = this.deviceCommandService.getVariables();
                    if (this.dataRead == null) {
                        this.frequencyRX = 0;
                        this.currentRX
                    } else {
                        if (this.dataRead.length > 6) {
                            this.dataRead = null
                            this.cancelConnection();
                        }
                        this.frequencyRX = this.convertToByteArray(this.dataRead[0], this.dataRead[1]);
                        this.currentRX = this.convertToByteArray(this.dataRead[2], this.dataRead[3]);
                        this.voltageRX = this.convertToByteArray(this.dataRead[4], this.dataRead[5]);
                    }
                } else {
                    this.checkConnection++;
                    if (this.checkConnection > 3) {
                        this.cancelConnection();
                    }
                }
            }, 1000);
        });
    }

    private disconnect() {
        this.deviceCommandService.disconnectToDevice().then((device) => {
            if (device != null) {
                clearTimeout(this.scanRate);
                this.frequencyRX = 0;
                this.currentRX = 0;
                this.voltageRX = 0;
                this.btnConnect.text = "Conectar";
                this.btnConnect.backgroundColor = this.toConnectColor;
                this.isConnected = false;
                TNSFancyAlert.showSuccess("Aviso", "A conexão foi finalizada com sucesso.", "Voltar");
            } else {
                TNSFancyAlert.showError("Erro!", "Ocorreu uma falha ao tentar deconectar.", "Voltar");
            }
        });
    }

    private cancelConnection() {
        clearTimeout(this.scanRate);
        this.frequencyRX = 0;
        this.currentRX = 0;
        this.voltageRX = 0;
        this.btnConnect.text = "Conectar";
        this.btnConnect.backgroundColor = this.toConnectColor;
        this.isConnected = false;
        this.checkConnection = 0;
        TNSFancyAlert.showError("Erro!", "O dispositivo não está mais respondendo.", "Voltar");
    }

    private convertToByteArray(highByte: number, lowByte: number): number {
        if (highByte == 0)
            return lowByte;
        if (highByte > 0)
            return 256 * highByte + lowByte;
        return 0;
    }

}