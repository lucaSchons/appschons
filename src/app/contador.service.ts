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
  variavel_produto: Object[] = [];

  constructor(private firestore: Firestore) { }

  incrementar(id: string) {
    this.contadorSubject.next(this.contadorSubject.value + 1);
    const novoQuantidadeProduto = { ...this.quantidadeProdutoSubject.value };

    if (!novoQuantidadeProduto[id]) {
      novoQuantidadeProduto[id] = 1;
    } else {
      novoQuantidadeProduto[id]++;
    }

    this.quantidadeProdutoSubject.next(novoQuantidadeProduto);
  }

  decrementar(id: string) {
    this.contadorSubject.next(this.contadorSubject.value - 1);
    const novoQuantidadeProduto = { ...this.quantidadeProdutoSubject.value };

    if (!novoQuantidadeProduto[id]) {
      novoQuantidadeProduto[id] = 1;
    } else {
      novoQuantidadeProduto[id]--;
    }

    this.quantidadeProdutoSubject.next(novoQuantidadeProduto);
  }
}
