import { ContadorService } from './contador.service';
import { PadariaComponent } from './padaria/padaria.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'appschons';
  hidden = false;
  isMenuOpen = false;
  
  constructor(public contadorService: ContadorService){
    console.log("dentro do app component", contadorService.contador);
  }
  
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  

  closeMenu() {
    this.isMenuOpen = false;
  }

}
