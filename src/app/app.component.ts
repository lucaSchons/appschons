import { BehaviorSubject, Observable } from 'rxjs';
import { ContadorService } from './contador.service';
import { PadariaComponent } from './padaria/padaria.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'appschons';
  hidden = false;
  isMenuOpen = false;
  quantidade: number = 0;
 
  constructor(public contadorService: ContadorService){}

  ngOnInit(){
    this.obtemTotalContador();
  }
  
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  obtemTotalContador() {
    if (localStorage.getItem('contador')) {
      const quantidadeString = localStorage.getItem('contador');
      const quantidade = quantidadeString ? +quantidadeString : 0;
      this.quantidade = quantidade;
    } else{
      this.quantidade = 0;
    }
    return this.quantidade;
  }
  
}
