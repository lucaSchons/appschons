import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { Routes } from "@angular/router";
import { homeComponent } from "./home/home.component";
import { PadariaComponent } from "./padaria/padaria.component";
import { DialogPadaria } from "./dialog-padaria/dialog-padaria.component";
import { OrderComponent } from "./order/order.component";

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: homeComponent },
    { path: 'padaria', component: PadariaComponent },
    { path: 'dialog', component: DialogPadaria },
    { path: 'order', component: OrderComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule {

}