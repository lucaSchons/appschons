import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pedidoItem } from './pedido-item.model';
import { ProdutoEncomenda } from './produto-encomenda.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements OnInit {
  contadorSubject = new BehaviorSubject<number>(0);
  contador = this.contadorSubject.asObservable();

  pedido: pedidoItem[] = [];
  orderSubject = new BehaviorSubject<pedidoItem[]>(this.pedido);
  order = this.orderSubject.asObservable();

  constructor() { }

  ngOnInit() { }

  getOrder() {
    return this.order;
  }

  incrementar(produto: ProdutoEncomenda) {
    const newOrder: pedidoItem[] = [...this.orderSubject.value];
    console.log("NEW ORDER NO INICIO ", newOrder);
    const produtosLocalStorage = localStorage.getItem('@schons');

    if (localStorage.getItem('contador')) {
      const quantidadeString = localStorage.getItem('contador');
      const quantidade = quantidadeString ? +quantidadeString : 0;
      const resultado = quantidade + 1;
      this.contadorSubject.next(resultado);
    } else {
      this.contadorSubject.next(this.contadorSubject.value + 1)
    }

    if (produtosLocalStorage !== null) {
      const objeto = JSON.parse(produtosLocalStorage);
      const instancia = objeto;

      if (instancia !== undefined) {
        const instancia = objeto.find((item: { descricao_produto: string; }) => item.descricao_produto === produto.descricao);

        if (instancia !== undefined) {
          const varNewOrder: pedidoItem[] = [...this.orderSubject.value];
          const quantidade = instancia.quantidade_produto;

          const index = varNewOrder.findIndex(item => item.descricao_produto === produto.descricao);

          if (index !== -1) {
            varNewOrder[index].quantidade_produto = quantidade + 1;
          }
          console.log("dentro da INSTANCIA 1", varNewOrder)
          this.orderSubject.next(varNewOrder);

          localStorage.setItem('@schons', JSON.stringify(varNewOrder));
        } else{
          const novoItem: pedidoItem = {
            descricao_produto: produto.descricao,
            quantidade_produto: 1,
            valor_unitario_produto: produto.valor,
            ingredientes: produto.ingredientes,
            imageUrl: produto.imageUrl
          };
          console.log("ENTREI ", novoItem);
          newOrder.push(novoItem);
        }
      }
    } else {

      const novoItem: pedidoItem = {
        descricao_produto: produto.descricao,
        quantidade_produto: 1,
        valor_unitario_produto: produto.valor,
        ingredientes: produto.ingredientes,
        imageUrl: produto.imageUrl
      };
      console.log("ENTREI ", novoItem);
      newOrder.push(novoItem);
    }

    this.orderSubject.next(newOrder);
    this.order.subscribe(result => {});

    localStorage.setItem('@schons', JSON.stringify(newOrder));
  }



  // decrementar(descricao: string) {
  //   const novoQuantidadeProduto = { ...this.quantidadeProdutoSubject.value };
  //   const quantidadeStorage = localStorage.getItem('@schons');

  //   if (localStorage.getItem('contador')) {
  //     const quantidadeString = localStorage.getItem('contador');
  //     const quantidade = quantidadeString ? +quantidadeString : 0;
  //     let quantidade_ext = quantidade;
  //     console.log("quantidade vinda do storage", quantidade_ext);
  //     console.log("produto quantidade", novoQuantidadeProduto[descricao]);
  //     if(quantidade_ext >= 2 && novoQuantidadeProduto[descricao] !== 0){
  //       const resultado = quantidade_ext -1;
  //       console.log("resultado", resultado);
  //       this.contadorSubject.next(resultado);
  //     }else if(quantidade_ext === 1 && novoQuantidadeProduto[descricao] !== 0){
  //       this.contadorSubject.next(0);
  //     }
  //   }

  //   if (quantidadeStorage !== null) {
  //     const quantidadeObj = JSON.parse(quantidadeStorage);
  //     const quantidade = quantidadeObj[descricao];

  //     if(quantidade >= 2 && novoQuantidadeProduto[descricao] !== 0){
  //       const resultado = quantidade -1;
  //       novoQuantidadeProduto[descricao] = resultado;
  //     }else if(quantidade === 1 && novoQuantidadeProduto[descricao] !== 0){
  //       alert("tem certeza que deseja excluir item?");
  //       novoQuantidadeProduto[descricao] = 0;
  //     }
  //     for (const chave in quantidadeObj) {
  //       if (quantidadeObj.hasOwnProperty(chave) && !novoQuantidadeProduto.hasOwnProperty(chave)) {
  //         novoQuantidadeProduto[chave] = quantidadeObj[chave];
  //       }
  //     }

  //   } else {

  //     if (!novoQuantidadeProduto[descricao] || novoQuantidadeProduto[descricao] === 0) {
  //       alert("seu produto está zerado");
  //       novoQuantidadeProduto[descricao] = 0;
  //     } 
  //     // else if (novoQuantidadeProduto[descricao] === 1) {
  //     //   alert("tem certeza que deseja excluir item?");
  //     //   novoQuantidadeProduto[descricao] = 0;
  //     // } else {
  //     //   novoQuantidadeProduto[descricao]--;
  //     // }
  //   }  

  //   this.quantidadeProdutoSubject.next(novoQuantidadeProduto);
  //   localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value))
  //   this.quantidadeProduto.subscribe(result =>{
  //     this.produto = result;
  //   });
  //   localStorage.setItem('@schons', JSON.stringify(this.produto));
  // }
}