import { BehaviorSubject, Observable } from 'rxjs';
import { OrderService } from '../order.service';
import { Component, OnInit } from "@angular/core";
import { collection, addDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { pedidoItem } from '../pedido-item.model';
import { ProdutoService } from '../produtos.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  produtos!: Observable<any[]>;
  precoTotal = new BehaviorSubject<number>(0);
  dadosDaOrdem: pedidoItem[] = [];

  constructor(private orderService: OrderService, public produtoService: ProdutoService, private firestore: Firestore) { }

  ngOnInit() {
    this.produtos = this.orderService.getOrder();
    const objetosLocalStorage = localStorage.getItem('@schons');
    if (objetosLocalStorage !== null) {
      const arrayObjetos = JSON.parse(objetosLocalStorage);
      let resultado_total = 0;
      arrayObjetos.forEach((item: { items: { produto: any; }; }) => {
        console.log("ENTREI", item.items.produto[0]);
        const descricao = item.items.produto[0].descricao_produto;
        const valor_unitario = item.items.produto[0].valor_unitario_produto || 0;
        const quantidade = item.items.produto[0].quantity;
        const resultado = valor_unitario * quantidade;
        console.log("ENTREI", valor_unitario, descricao, quantidade);
        resultado_total += resultado;
        const novoItem: pedidoItem = {
          items: {
            produto: [{
              descricao_produto: descricao,
              valor_unitario_produto: valor_unitario,
              quantity: quantidade,
              ingredientes: null,
              imageUrl: null
            }],
            valor_total: null,
          },
          user: {
            name: null,
            phone: null,
          }
        };
        this.dadosDaOrdem.push(novoItem);
      });
      
      this.precoTotal.next(resultado_total);
    }
  }

  finishOrder() {
    const dadosParaFirestore = this.dadosDaOrdem.map((item: pedidoItem) => ({
      produto: item.items.produto.map((produtoItem) => ({
        descricao_produto: produtoItem.descricao_produto,
        valor_unitario_produto: produtoItem.valor_unitario_produto,
        quantity: produtoItem.quantity,
      })),
    }));

    const docRef = addDoc(collection(this.firestore, "pedido_item"), {
      items: dadosParaFirestore,
      valor_total: this.precoTotal.value,
      user: null,
      phone: null,
    });
    console.log(docRef);
  }

}