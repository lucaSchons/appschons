import { BehaviorSubject, Observable } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Component, OnInit } from "@angular/core";
import { collection, addDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { pedidoItem } from '../../pedido-item.model';
import { ProdutoService } from '../../services/produtos.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  produtos!: Observable<any[]>;
  precoTotal = new BehaviorSubject<number>(0);
  dadosDaOrdem: pedidoItem[] = [];
  dadosString: string = "";
  linkWhatsApp: any;
  numeroCelular: string = '';
  contador = new BehaviorSubject<number>(0);
  

  constructor(private orderService: OrderService, public produtoService: ProdutoService, private firestore: Firestore) { 
    this.contador = this.orderService.getContador();
    this.contador.subscribe({})
  }

  ngOnInit() {
    this.produtos = this.orderService.getOrder();
    const objetosLocalStorage = localStorage.getItem('@schons');
    if (objetosLocalStorage !== null) {
      const arrayObjetos = JSON.parse(objetosLocalStorage);
      let resultado_total = 0;
      arrayObjetos.forEach((item: { items: { produto: any; }; }) => {
        const descricao = item.items.produto[0].descricao_produto;
        const valor_unitario = item.items.produto[0].valor_unitario_produto || 0;
        const quantidade = item.items.produto[0].quantity;
        const resultado = valor_unitario * quantidade;
        resultado_total += resultado;
        if (quantidade > 0) {
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
          // this.orderService.orderSubject.next(this.dadosDaOrdem);
        }
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

    this.dadosString += `Mercearia Schons. \n\n`;
    this.dadosString += `Agradecemos por realizar seu pedido. Segue abaixo um resumo do mesmo: \n\n `;

    dadosParaFirestore.forEach((item) => {
      item.produto.forEach((produtoItem) => {
        this.dadosString += `Descrição: ${produtoItem.descricao_produto},\n`;
        this.dadosString += `Valor Unitário: R$ ${produtoItem.valor_unitario_produto},\n`;
        this.dadosString += `Quantidade: ${produtoItem.quantity}\n\n`;
      });
    });
    this.dadosString += `\nValor Total: R$ ${this.precoTotal.value}`;
    const dadosStringEncoded = encodeURIComponent(this.dadosString);

    this.linkWhatsApp = `https://wa.me/5551980521997?text=${dadosStringEncoded}`;
    console.log('Número de celular:', this.numeroCelular);

    const docRef = addDoc(collection(this.firestore, "pedido_item"), {
      items: dadosParaFirestore,
      valor_total: this.precoTotal.value,
      user: null,
      phone: null,
    });

    const docRefMessage = addDoc(collection(this.firestore, "messages"), {
      to: "+5551980521997",
      from: "+12067178491",
      body: this.dadosString,
    })

    const docRefMessageMercearia = addDoc(collection(this.firestore, "messages"), {
      to: "+5551980302443",
      from: "+12067178491",
      body: this.dadosString,
    })
    console.log(docRef);
  }

}