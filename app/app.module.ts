import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NSModuleFactoryLoader } from "nativescript-angular/router";

import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { InverterComponent } from "./modules/inverter/inverter.component";

import { DeviceCommandService } from './services/device-command.service';
import { BluetoothService } from './services/bluetooth.service';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        InverterComponent
    ],
    providers: [
        DeviceCommandService,
        BluetoothService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class AppModule { }
