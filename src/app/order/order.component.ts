import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { ContadorService } from './../contador.service';
import { Component, Input, OnInit } from "@angular/core";
import { collection, getDoc, doc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { pedidoItem } from '../pedido-item.model';
import { ProdutoService } from '../produtos.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
    contadorTotal!: number;
    produtos!: Observable<any[]>;
    precoTotal = new BehaviorSubject<number>(0);
    variavel_produtos_encomenda!: Observable<any[]>
    variavel_quantidade: number[] = [];
    variavel_preco: number[] = [];

    constructor(private contador: ContadorService, public produtoService: ProdutoService) { }

    ngOnInit() {
        const arrayStorage = localStorage.getItem('@schons');
        if (arrayStorage !== null) {
            console.log("entrei");
            const produto = JSON.parse(arrayStorage);
            this.produtos = this.contador.quantidadeProduto.pipe(
                map(quantidades => {
                    return Object.keys(produto)
                        .filter(key => produto[key] > 0)
                        .map(key => ({
                            id: key,
                            quantidade: produto[key]
                        }));
                })
            );
            if(this.produtos){
                this.calcularPrecoTotal();
            }
        }
    }

    calcularPrecoTotal() {
        this.produtos.subscribe(produtosEncomenda => {
            produtosEncomenda.forEach(produto => {
                const descricao = produto.id;
                const quantidade =  produto.quantidade;
                
                this.produtoService.getProduto(descricao).subscribe(produto => {
                    const valor_unitario = produto[0]?.['valor_unitario'] || 0;
                    
                    this.variavel_quantidade.push(quantidade);
                    this.variavel_preco.push(valor_unitario);
                    this.valorobtido();
                });
            });
        });
    }

    async valorobtido(){
        console.log(this.variavel_quantidade, this.variavel_preco);
        let resultado = 0;
        let resultadoTotal = 0;
        for(let i=0; i < this.variavel_quantidade.length; i++){
            resultado = this.variavel_quantidade[i] * this.variavel_preco[i];
            resultadoTotal += resultado;
        }
        this.precoTotal.next(resultadoTotal);
    }

    // encomendar() {
    //     const novoProduto: pedidoItem = {
    //         id_produto: idProduto,
    //         descricao_produto: nomeProduto,
    //         quantidade_produto: quantidade_produto,
    //         valor_unitario_produto: valor_unitario,
    //         valor_total_pedido: this.valor_total
    //     };
    //     this.finalizar_pedido_produtos.forEach((produto: pedidoItem) => {
    //         this.descricao.push(produto.descricao_produto);
    //         this.quantidade.push(produto.quantidade_produto);
    //         this.valor_unit.push(produto.valor_unitario_produto);
    //         this.valor_total_var = produto.valor_total_pedido;
    //     });

    //     const docRef = addDoc(collection(this.firestore, "pedido_item"), {
    //         produto_desc: this.descricao,
    //         valor_unit: this.valor_unit,
    //         quantidade: this.quantidade,
    //         valor_total: this.valor_total_var
    //     });
    // }

}



    