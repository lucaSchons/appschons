import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContadorService {
  contadorSubject = new BehaviorSubject<number>(0);
  contador = this.contadorSubject.asObservable();
  private quantidadeProdutoSubject = new BehaviorSubject<{ [key: string]: number }>({});
  quantidadeProduto = this.quantidadeProdutoSubject.asObservable();

  constructor(private firestore: Firestore) { }

  incrementar(descricao: string) {
    const novoQuantidadeProduto = { ...this.quantidadeProdutoSubject.value };
    if (localStorage.getItem('contador')) {
      const quantidadeString = localStorage.getItem('contador');
      const quantidade = quantidadeString ? +quantidadeString : 0;
      const resultado = quantidade + 1;
      this.contadorSubject.next(resultado);

    } else {
      this.contadorSubject.next(this.contadorSubject.value + 1)
    }

    if (localStorage.getItem(descricao)) {
      const quantidadeString = localStorage.getItem(descricao);
      const quantidade = quantidadeString ? +quantidadeString : 0;
      const resultado = quantidade + 1;
      novoQuantidadeProduto[descricao] = resultado;

    } else {

      if (!novoQuantidadeProduto[descricao]) {
        novoQuantidadeProduto[descricao] = 1;
      } else {
        novoQuantidadeProduto[descricao]++;
      }
    }

    localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value))
    this.quantidadeProdutoSubject.next(novoQuantidadeProduto);
    localStorage.setItem(descricao, JSON.stringify(novoQuantidadeProduto[descricao]));
  }

  decrementar(descricao: string) {
    if (this.contadorSubject.value >= 1) {
      this.contadorSubject.next(this.contadorSubject.value - 1);
    }
    const novoQuantidadeProduto = { ...this.quantidadeProdutoSubject.value };
    if (localStorage.getItem(descricao)) {
      const quantidadeString = localStorage.getItem(descricao);
      const quantidade = quantidadeString ? +quantidadeString : 0;
      console.log("acessando localstorage", quantidade);
      const resultado = quantidade - 1;
      novoQuantidadeProduto[descricao] = resultado;

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
    localStorage.setItem(descricao, JSON.stringify(novoQuantidadeProduto[descricao]));
  }  
}