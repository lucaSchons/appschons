import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { OrderService } from './order.service';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { PadariaComponent } from './padaria/padaria.component';
import { DialogPadaria } from './dialog-padaria/dialog-padaria.component';
import { OrderComponent } from './order/order.component';
import { ProdutoService } from './produtos.service';

@NgModule({
  declarations: [
    AppComponent,
    PadariaComponent,
    DialogPadaria,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatBadgeModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [OrderService, ProdutoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
