import { BehaviorSubject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Component, OnInit } from "@angular/core";
import { collection, addDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { pedidoItem } from '../../pedido-item.model';
import { ProdutoService } from '../../services/produtos.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  precoTotal = new BehaviorSubject<number>(0);
  dadosStringCliente: string = "";
  dadosString = "";
  linkWhatsApp: any;
  contador = new BehaviorSubject<number>(0);
  contadorProduto = new BehaviorSubject<number>(0);
  produtoEncomendaSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  carrinhoVazio: boolean = false;

  constructor(public orderService: OrderService, public produtoService: ProdutoService, private firestore: Firestore, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    const produtoStorage = localStorage.getItem('@schons');
    if (produtoStorage !== null) {
      const arrayProdutoEncomenda = JSON.parse(produtoStorage);
      if (Array.isArray(arrayProdutoEncomenda) && arrayProdutoEncomenda.length === 0 ) {
        this.carrinhoVazio = true;
      } else {
        this.carrinhoVazio = false;
      }
    } 

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
      if (res === 0) {
        this.carrinhoVazio = true;
      }
      this.contador.next(res);
    })
  }
 
  getOrderQuantity(produto: string) {
    let quantidades;
    const produtoStorage = localStorage.getItem('@schons');

    if (produtoStorage !== null) {
      this.carrinhoVazio = false;
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
    }

    return quantidades;
  }

  cleanPage() {
    localStorage.removeItem('@schons');
    localStorage.removeItem('memory_idx');
    localStorage.removeItem('contador'); 
  }

  encaminharUsuario() {
    this.cleanPage();
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: this.linkWhatsApp
    });
  
    dialogRef.afterClosed().subscribe(() => {
      window.location.href = '/padaria';
    });
  }

  onSubmit(form: NgForm) {
    this.produtoEncomendaSubject.asObservable().subscribe((res: pedidoItem[]) => {
      const dadosParaFirestore = res.map((item: pedidoItem) => ({
        produto: item.items.produto.map((produtoItem) => ({
          descricao_produto: produtoItem.descricao,
          valor_unitario_produto: produtoItem.valor,
          quantity: produtoItem.quantity,
        })),
      }));
      const nome = form.value.nome;
      const telefone = form.value.telefone;

      this.dadosStringCliente += `Olá, ${nome}! Somos da Mercearia Schons. \n\n`;
      this.dadosStringCliente += `Agradecemos por realizar seu pedido. Segue abaixo um resumo do mesmo: \n\n`;
      this.dadosString += `Mercearia Schons.\n`;
      this.dadosString += `Olá! Segue pedido realizado pelo site:\n\n`;

      dadosParaFirestore.forEach((item) => {
        item.produto.forEach((produtoItem) => {
          this.dadosStringCliente += `Descrição: ${produtoItem.descricao_produto},\n`;
          this.dadosStringCliente += `Valor Unitário: R$ ${produtoItem.valor_unitario_produto},\n`;
          this.dadosStringCliente += `Quantidade: ${produtoItem.quantity}\n\n`;
          this.dadosString += `Descrição: ${produtoItem.descricao_produto},\n`;
          this.dadosString += `Valor Unitário: R$ ${produtoItem.valor_unitario_produto},\n`;
          this.dadosString += `Quantidade: ${produtoItem.quantity}\n\n`;
        });
      });
      this.dadosStringCliente += `Valor Total do pedido: R$ ${this.precoTotal.value}.\n`;
      this.dadosString += `Valor Total do pedido: R$ ${this.precoTotal.value}.\n`;
      const dadosStringEncoded = encodeURIComponent(this.dadosString);
      this.linkWhatsApp = `https://wa.me/5551980521997?text=${dadosStringEncoded}`;

      const docRef = addDoc(collection(this.firestore, "pedido_item"), {
        items: dadosParaFirestore,
        valor_total: this.precoTotal.value,
        user: nome,
        phone: telefone,
      });

      const numeroCompleto = "+55" + telefone;
      const docRefMessage = addDoc(collection(this.firestore, "messages"), {
        to: "'" + numeroCompleto + "'",
        from: "+12067178491",
        body: this.dadosString,
      })
      const docRefMessageMercearia = addDoc(collection(this.firestore, "messages"), {
        to: "+5551980302443",
        from: "+12067178491",
        body: this.dadosStringCliente,
      })
    });
   
    this.encaminharUsuario();
  }

}