import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    title = 'Mercearia Schons';
    hidden = false;
    isMenuOpen = false;
    quantidade: number = 0;
    icon_close = false;
    icon_hambuguer = true;
   
    constructor() { }
    
    ngOnInit(){
      this.obtemTotalContador();
    
    }
    
    toggleBadgeVisibility() {
      this.hidden = !this.hidden;
    }
  
    closeMenu() {
      this.isMenuOpen = false;
      this.icon_close = false;
      this.icon_hambuguer = true;
    }

    iconCloseActive(){
      this.icon_close = true;
      this.icon_hambuguer = false;
    }

    iconCloseDesativar(){
      this.icon_close = false;
      this.icon_hambuguer = true;
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