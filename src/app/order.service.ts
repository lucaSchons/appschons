import { Produto } from './produto.model';
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

  ngOnInit() {}

  getOrder() {
    return this.order;
  }

  addProduct(produto: ProdutoEncomenda) {
    const novoPedido: pedidoItem[] = [...this.orderSubject.value];
    console.log("NOVO PEDIDO NO INICIO ", novoPedido);
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
      console.log("PRIMEIRO IF ", instancia)
      if (objeto.length > 0) {
        this.orderSubject.next(objeto);
      }
     
      if (instancia !== undefined) {
        const itemExistente = objeto.find((item: pedidoItem) => item.items.produto.some(p => p.descricao_produto === produto.descricao));
        
        if (itemExistente !== undefined ) {
          const quantidade = itemExistente.items.produto[0].quantity;
          const varNewOrder: pedidoItem[] = [...this.orderSubject.value];
          
          if(varNewOrder.length === 0){
            itemExistente.items.produto[0].quantity = quantidade + 1;
            varNewOrder.push(itemExistente);
          }else{
            const index = varNewOrder.findIndex(item => item.items.produto[0].descricao_produto === produto.descricao);
            if (index !== -1) {
              console.log("QUANTIDADE DE VAR NEW ORDER ", quantidade);
              varNewOrder[index].items.produto[0].quantity = quantidade + 1;
            }
          }

          this.orderSubject.next(varNewOrder);
          localStorage.setItem('@schons', JSON.stringify(varNewOrder));

        } else{
          const novoItem: pedidoItem = {
            items: {
              produto: [{
                descricao_produto: produto.descricao,
                valor_unitario_produto: produto.valor,
                quantity: 1,
                ingredientes: produto.ingredientes,
                imageUrl: produto.imageUrl
              }],
              valor_total: null,
            },
            user: {
              name: null,
              phone: null,
            }
          };
          novoPedido.push(novoItem);
          this.orderSubject.next(novoPedido);
          localStorage.setItem('@schons', JSON.stringify(novoPedido));
        }
      }
      
    } else {

      const novoItem: pedidoItem = {
        items: {
          produto: [{
            descricao_produto: produto.descricao,
            valor_unitario_produto: produto.valor,
            quantity: 1,
            ingredientes: produto.ingredientes,
            imageUrl: produto.imageUrl
          }],
          valor_total: null,
        },
        user: {
          name: null,
          phone: null,
        }
      };
      novoPedido.push(novoItem);
      this.orderSubject.next(novoPedido);
      localStorage.setItem('@schons', JSON.stringify(novoPedido));
    }

    this.order.subscribe(result => { });
    localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value));
    
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