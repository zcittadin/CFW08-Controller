import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { InverterComponent } from "./modules/inverter/inverter.component";

const routes: Routes = [
    { path: "", redirectTo: "/inverter", pathMatch: "full" },
    { path: "inverter", component: InverterComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }