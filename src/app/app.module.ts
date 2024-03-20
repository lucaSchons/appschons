import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { OrderService } from './services/order.service';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { PadariaComponent } from './components/padaria/padaria.component';
import { DialogPadaria } from './components/dialog-padaria/dialog-padaria.component';
import { OrderComponent } from './components/order/order.component';
import { ProdutoService } from './services/produtos.service';
import { PrevDirective } from './services/prev.directive';
import { NextDirective } from './services/next.directive';
import { SobreComponent } from './components/sobre/sobre.component';
import { ContatoComponent } from './components/contato/contato.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    PadariaComponent,
    DialogPadaria,
    OrderComponent,
    PrevDirective,
    NextDirective,
    SobreComponent,
    ContatoComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent
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
