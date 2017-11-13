import { View } from 'tns-core-modules/ui/core/view';
import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { setTimeout } from "timer";
import * as utils from "utils/utils";

import { TextField } from "ui/text-field";

@Component({
    selector: "my-modal",
    moduleId: module.id,
    templateUrl: "app.modal.html",
    styleUrls: ["modal.css"]
})
export class ModalComponent implements AfterViewInit {

    private txtFrequencia: any;

    @ViewChild("txtFrequencia") txtFrequenciaRef: ElementRef;

    public constructor(private params: ModalDialogParams) { }

    ngAfterViewInit() {
        this.txtFrequencia = <TextField>this.txtFrequenciaRef.nativeElement;
        setTimeout(() => {
            utils.ad.showSoftInput(this.txtFrequencia.android);
        }, 120);
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

}