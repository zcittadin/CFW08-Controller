import { Component, AfterViewInit, ElementRef, ViewChild, ViewContainerRef } from "@angular/core";
import { setInterval, clearTimeout } from "timer";

import { Switch } from "ui/switch";

import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

import { Button } from "ui/button";
import { Color } from "color";

@Component({
    selector: "Inverter",
    moduleId: module.id,
    templateUrl: "inverter.component.html",
    styleUrls: ["inverter.css"]
})
export class InverterComponent implements AfterViewInit {

    private switchMotor: any;
    private switchSentido: any;

    @ViewChild("switchMotor") switchMotorRef: ElementRef;
    @ViewChild("switchSentido") switchSentidoRef: ElementRef;

    ngAfterViewInit() {
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
        TNSFancyAlert.showSuccess("OK", "Conexão vai aqui.", "Voltar");
    }

    public changeFrquency() {
        TNSFancyAlert.showSuccess("OK", "Mude a freqüência.", "Voltar");
    }

    public toggleMotor() {
        if (this.switchMotor.checked) {
            console.log("LIGADO");
        } else {
            console.log("DESLIGADO");
        }
    }

    public toggleSentido() {
        if (this.switchSentido.checked) {
            console.log("HORÁRIO");
        } else {
            console.log("ANTI-HORÁRIO");
        }
    }

}