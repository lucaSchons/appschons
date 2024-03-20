import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { PadariaComponent } from "./components/padaria/padaria.component";
import { DialogPadaria } from "./components/dialog-padaria/dialog-padaria.component";
import { OrderComponent } from "./components/order/order.component";
import { SobreComponent } from "./components/sobre/sobre.component";
import { ContatoComponent } from "./components/contato/contato.component";

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'padaria', component: PadariaComponent },
    { path: 'dialog', component: DialogPadaria },
    { path: 'order', component: OrderComponent },
    { path: 'sobre', component: SobreComponent },
    { path: 'contato', component: ContatoComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule {

}