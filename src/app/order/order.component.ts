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
    dadosDaOrdem!: pedidoItem[];
    produto_finalizar_order: any[] = [];

    constructor(private orderService: OrderService, public produtoService: ProdutoService, private firestore: Firestore) { }

    ngOnInit() {
        this.produtos = this.orderService.getOrder();
        this.produtos.subscribe((dados: pedidoItem[]) => {
            this.dadosDaOrdem = dados;
            let resultado_total = 0;
            dados.forEach((dado: pedidoItem) =>{
                console.log("valor", dado.valor_unitario_produto);
                const valor_unitario = dado.valor_unitario_produto || 0;
                const quantidade = dado.quantidade_produto;
                const resultado = valor_unitario * quantidade;
                
                resultado_total += resultado; 
            })
            this.precoTotal.next(resultado_total);
        });
    }

    finishOrder(){
        this.produto_finalizar_order = this.dadosDaOrdem.map((item: pedidoItem) => ({
            produto_descricao: item.descricao_produto,
            valor_unitario: item.valor_unitario_produto,
            quantidade: item.quantidade_produto,
            valor_total: item.valor_unitario_produto || 0 * item.quantidade_produto
        }));
        
        const collectionRef = collection(this.firestore, "pedido_item");
    
        this.produto_finalizar_order.forEach(async (dados) => {
            const docRef = await addDoc(collectionRef, dados);
            console.log("Documento adicionado com ID: ", docRef.id);
        });
    }

}