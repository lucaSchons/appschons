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
  precoTotal = new BehaviorSubject<number>(0);
  dadosDaOrdem: pedidoItem[] = [];
  dadosString: string = "";
  linkWhatsApp: any;
  numeroCelular: string = '';
  contador = new BehaviorSubject<number>(0);
  contadorProduto = new BehaviorSubject<number>(0);

  produtoEncomendaSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(public orderService: OrderService, public produtoService: ProdutoService, private firestore: Firestore) { }

  ngOnInit() {
    this.produtoEncomendaSubject = this.orderService.getOrder();
    this.produtoEncomendaSubject.asObservable().subscribe(result => {
      let resultado = 0;
      for (let i = 0; i < result.length; i++) {
        const valor_unitario = result[i].items.produto[0].valor || 0;
        const quantidade = result[i].items.produto[0].quantity;
        const resultado_var = valor_unitario * quantidade; 
        resultado += resultado_var;
      }
      this.precoTotal.next(resultado);
    });
    this.contadorProduto = this.orderService.getContador();
    this.contadorProduto.subscribe(res => {
      this.contador.next(res);
    })

  }

  getOrderQuantity(produto: string) {
    let quantidades;
    const produtoStorage = localStorage.getItem('@schons');

    if (produtoStorage !== null) {
      const objetoProdutoEncomenda = JSON.parse(produtoStorage);
      let descricao = "";
      let valor = 0;
      let quantidade = 0;
      let image = "";

      for (let i = 0; i < objetoProdutoEncomenda.length; i++) {
        descricao = objetoProdutoEncomenda[i].items.produto[0].descricao;
        valor = objetoProdutoEncomenda[i].items.produto[0].valor || 0;
        quantidade = objetoProdutoEncomenda[i].items.produto[0].quantity;
        image = objetoProdutoEncomenda[i].items.produto[0].imageUrl;

        if (descricao === produto) {
          const quant = objetoProdutoEncomenda[i].items.produto[0].quantity;
          quantidades = quant;
        }
      }

    } else {
      console.log("CARRINHO VAZIO");
    }

    return quantidades;
  }

  finishOrder() {
    const dadosParaFirestore = this.dadosDaOrdem.map((item: pedidoItem) => ({
      produto: item.items.produto.map((produtoItem) => ({
        descricao_produto: produtoItem.descricao,
        valor_unitario_produto: produtoItem.valor,
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

    // const docRefMessage = addDoc(collection(this.firestore, "messages"), {
    //   to: "+5551980521997",
    //   from: "+12067178491",
    //   body: this.dadosString,
    // })

    // const docRefMessageMercearia = addDoc(collection(this.firestore, "messages"), {
    //   to: "+5551980302443",
    //   from: "+12067178491",
    //   body: this.dadosString,
    // })
    console.log(docRef);
  }

}