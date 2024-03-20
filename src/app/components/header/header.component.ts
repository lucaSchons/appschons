import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    title = 'appschons';
    hidden = false;
    isMenuOpen = false;
    quantidade: number = 0;
   
    constructor(){}
  
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