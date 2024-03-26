import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pedidoItem } from '../pedido-item.model';
import { ProdutoEncomenda } from '../produto-encomenda.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements OnInit {
  contadorSubject = new BehaviorSubject<number>(0);
  contador = this.contadorSubject.asObservable();
  contador_var = new BehaviorSubject<number>(0);
  memorizador_index: any[] = [];
  isSelect_buttonAdd: boolean[] = [];
  isSelect_button: boolean[] = [];

  pedido: pedidoItem[] = [];
  orderSubject = new BehaviorSubject<any[]>(this.pedido);
  order = this.orderSubject.asObservable();

  constructor() { }

  ngOnInit() { }

  getContador() {
    if (localStorage.getItem('contador')) {
      const quantidadeString = localStorage.getItem('contador');
      const quantidade = quantidadeString ? +quantidadeString : 0;
      this.contador_var.next(quantidade);
    } else {
      this.contador_var.next(this.contadorSubject.value);
    }

    return this.contador_var;
  }

  getOrder() {
    const produtosLocalStorage = localStorage.getItem('@schons');
    if (produtosLocalStorage !== null) {
      const objeto = JSON.parse(produtosLocalStorage);
      const instancia = objeto;
      const novoPedido: pedidoItem[] = [];
      if (instancia !== undefined) {
        instancia.forEach((item: { items: { produto: any; }; }) => {
          const descricao = item.items.produto[0].descricao;
          const valor_unitario = item.items.produto[0].valor || 0;
          const quantidade = item.items.produto[0].quantity;
          const resultado = valor_unitario * quantidade;
          const image = item.items.produto[0].imageUrl;

          const novoItem: pedidoItem = {
            items: {
              produto: [{
                descricao: descricao,
                valor: valor_unitario,
                quantity: quantidade,
                ingredientes: null,
                imageUrl: image
              }],
              valor_total: null,
            },
            user: {
              name: null,
              phone: null,
            }
          };
          novoPedido.push(novoItem);
        });
        this.orderSubject.next(novoPedido);
      }
    }

    return this.orderSubject;
  }

  newProduct(index: number, produto: any) {
    const novoIndex = {
      id: index,
      descricao: produto.descricao
    }
    this.memorizador_index.push(novoIndex);
    localStorage.setItem('memory_idx', JSON.stringify(this.memorizador_index));
    this.isSelect_buttonAdd[index] = false;
    this.isSelect_button[index] = true;

    const novoPedido: pedidoItem[] = [...this.orderSubject.value];

    const itemExistente = novoPedido.find(item => {
      return item.items.produto.some(produtoExistente => produtoExistente.descricao === produto.descricao);
    });

    if (itemExistente) {
      itemExistente.items.produto[0].quantity++;

    } else {

      const novoItem: pedidoItem = {
        items: {
          produto: [{
            descricao: produto.descricao,
            valor: produto.valor,
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
    }
    this.orderSubject.next(novoPedido);
    localStorage.setItem('@schons', JSON.stringify(novoPedido));

    this.contadorSubject.next(this.contadorSubject.value + 1)

    localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value));
  }

  removeProduct(index: number, idx_array: number) {
    this.isSelect_buttonAdd[index] = true;
    this.isSelect_button[index] = false;
    const currentProducts = this.orderSubject.getValue();
    currentProducts.splice(idx_array, 1);

    this.orderSubject.next(currentProducts);
    localStorage.setItem('@schons', JSON.stringify(currentProducts));
  }

  incrementProduct(produto: any) {
    const novoPedido: pedidoItem[] = [...this.orderSubject.value];
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
      if (objeto.length > 0) {
        this.orderSubject.next(objeto);
      }

      if (instancia !== undefined) {
        const itemExistente = objeto.find((item: pedidoItem) => item.items.produto.some(p => p.descricao === produto.descricao));

        if (itemExistente !== undefined) {
          const quantidade = itemExistente.items.produto[0].quantity;
          const varNewOrder: pedidoItem[] = [...this.orderSubject.value];

          if (varNewOrder.length === 0) {
            itemExistente.items.produto[0].quantity = quantidade + 1;
            varNewOrder.push(itemExistente);
          } else {
            const index = varNewOrder.findIndex(item => item.items.produto[0].descricao === produto.descricao);
            if (index !== -1) {
              varNewOrder[index].items.produto[0].quantity = quantidade + 1;
            }
          }

          this.orderSubject.next(varNewOrder);
          localStorage.setItem('@schons', JSON.stringify(varNewOrder));

        } else {
          const novoItem: pedidoItem = {
            items: {
              produto: [{
                descricao: produto.descricao,
                valor: produto.valor,
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
    }

    this.order.subscribe(result => { });
    localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value));
  }

  decrementProduct(produto: any) {
    const novoPedido: pedidoItem[] = [...this.orderSubject.value];
    console.log("DECREMENT ", novoPedido);
    const produtosLocalStorage = localStorage.getItem('@schons');
    const idx_localStorage = localStorage.getItem('memory_idx');

    if (localStorage.getItem('contador')) {
      const quantidadeString = localStorage.getItem('contador');
      const quantidade = quantidadeString ? +quantidadeString : 0;
      let quantidade_ext = quantidade;
      if (quantidade_ext >= 2) {
        const resultado = quantidade_ext - 1;
        this.contadorSubject.next(resultado);
      } else if (quantidade_ext === 1) {
        this.contadorSubject.next(0);
      }
    }

    localStorage.setItem('contador', JSON.stringify(this.contadorSubject.value));

    if (produtosLocalStorage !== null) {
      const objeto = JSON.parse(produtosLocalStorage);
      const instancia = objeto;
      if (objeto.length > 0) {
        this.orderSubject.next(objeto);
      }

      if (instancia !== undefined) {
        const itemExistente = objeto.find((item: pedidoItem) => item.items.produto.some(p => p.descricao === produto.descricao));

        if (itemExistente !== undefined) {
          const quantidade = itemExistente.items.produto[0].quantity;
          const varNewOrder: pedidoItem[] = [...this.orderSubject.value];
          const index = varNewOrder.findIndex(item => item.items.produto[0].descricao === produto.descricao);
          if (quantidade >= 2 && index !== -1) {
            varNewOrder[index].items.produto[0].quantity = quantidade - 1;
            this.orderSubject.next(varNewOrder);
            localStorage.setItem('@schons', JSON.stringify(varNewOrder));

          } else if (quantidade === 1 && index !== -1) {
            var resposta = confirm("Tem certeza que deseja excluir o item?");

            if (resposta) {
              varNewOrder[index].items.produto[0].quantity = 0;
              if (idx_localStorage !== null) {
                const obj = JSON.parse(idx_localStorage);
                if (Array.isArray(obj) && obj.length > 0) {
                  this.memorizador_index.push(obj);
                  this.memorizador_index.forEach((item: any[]) => {
                    if (Array.isArray(item)) {
                      const resultado = item.find(index => index.descricao === produto.descricao);
                      if (resultado) {
                        this.removeProduct(resultado.id, index);
                      }
                    }
                  })
                }
              }
            }

          }

        }
      }
    }
  }
}

