import { Injectable, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContadorService implements OnInit{
  contadorSubject = new BehaviorSubject<number>(0);
  contador = this.contadorSubject.asObservable();
  private quantidadeProdutoSubject = new BehaviorSubject<{ [key: string]: number }>({});
  quantidadeProduto = this.quantidadeProdutoSubject.asObservable();
  produto!: any;

  constructor(private firestore: Firestore) { }

  ngOnInit(){}

  incrementar(descricao: string) {
    const novoQuantidadeProduto = { ...this.quantidadeProdutoSubject.value };
    const quantidadeStorage = localStorage.getItem('@schons');
    if (localStorage.getItem('contador')) {
      const quantidadeString = localStorage.getItem('contador');
      const quantidade = quantidadeString ? +quantidadeString : 0;
      const resultado = quantidade + 1;
      this.contadorSubject.next(resultado);
      
    } else {
      this.contadorSubject.next(this.contadorSubject.value + 1)
    }
    
    if (quantidadeStorage !== null) {
      const quantidadeObj = JSON.parse(quantidadeStorage);
      const quantidade = quantidadeObj[descricao];
      if(quantidade !== undefined) {
        const resultado = quantidade + 1;
        novoQuantidadeProduto[descricao] = resultado;
      }else{
        novoQuantidadeProduto[descricao] = 1;
      }
      for (const chave in quantidadeObj) {
        if (quantidadeObj.hasOwnProperty(chave) && !novoQuantidadeProduto.hasOwnProperty(chave)) {
          novoQuantidadeProduto[chave] = quantidadeObj[chave];
        }
      }

    } else {

      if (!novoQuantidadeProduto[descricao]) {
        novoQuantidadeProduto[descricao] = 1;
      } else {
        novoQuantidadeProduto[descricao]++;
      }
    }
    this.quantidadeProdutoSubject.next(novoQuantidadeProduto);
   
    localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value))
    this.quantidadeProduto.subscribe(result =>{
      this.produto = result;
    });
    localStorage.setItem('@schons', JSON.stringify(this.produto));
  }

  decrementar(descricao: string) {
    if (this.contadorSubject.value >= 1) {
      this.contadorSubject.next(this.contadorSubject.value - 1);
      if (localStorage.getItem('contador')) {
        const quantidadeString = localStorage.getItem('contador');
        const quantidade = quantidadeString ? +quantidadeString : 0;
        const resultado = quantidade - 1;
        this.contadorSubject.next(resultado);
        
      } else {
        this.contadorSubject.next(this.contadorSubject.value - 1)
      }
    }
    const novoQuantidadeProduto = { ...this.quantidadeProdutoSubject.value };
    const quantidadeStorage = localStorage.getItem('@schons');
  
    if (quantidadeStorage !== null) {
      const quantidadeObj = JSON.parse(quantidadeStorage);
      const quantidade = quantidadeObj[descricao];
      if(quantidade !== undefined && quantidade >= 1) {
        const resultado = quantidade - 1;
        novoQuantidadeProduto[descricao] = resultado;
      }else{
        novoQuantidadeProduto[descricao] = 0;
      }
      for (const chave in quantidadeObj) {
        if (quantidadeObj.hasOwnProperty(chave) && !novoQuantidadeProduto.hasOwnProperty(chave)) {
          novoQuantidadeProduto[chave] = quantidadeObj[chave];
        }
      }
    } else {

      if (!novoQuantidadeProduto[descricao] || novoQuantidadeProduto[descricao] === 0) {
        alert("seu produto está zerado");
        novoQuantidadeProduto[descricao] = 0;

      } else if (novoQuantidadeProduto[descricao] === 1) {
        alert("tem certeza que deseja excluir item?");
        novoQuantidadeProduto[descricao] = 0;
        this.contadorSubject.next(this.contadorSubject.value - 1);
      } else {
        novoQuantidadeProduto[descricao]--;
      }
    }
    this.quantidadeProdutoSubject.next(novoQuantidadeProduto);
    localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value))
    this.quantidadeProduto.subscribe(result =>{
      this.produto = result;
    });
    localStorage.setItem('@schons', JSON.stringify(this.produto));
  }  
}