import { Observable, map } from 'rxjs';
import { ContadorService } from './../contador.service';
import { Component, OnInit } from "@angular/core";
import { collection, getDoc, doc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { pedidoItem } from '../pedido-item.model';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
    contadorTotal!: number;
    produtos!: Observable<any>;
    variavel_produto!: string;
    variavel_produto_quantidade!: number;
    valor_total!: number;
    resultado_calculo: number = 0;
    finalizar_pedido_produtos: pedidoItem[] = [];
    descricao: string[] = [];
    quantidade: number[] = [];
    valor_unit: number[] = [];
    valor_total_var = 0;
    docId: string = "";

    constructor(private firestore: Firestore, private contador: ContadorService) { }

    ngOnInit() {
        this.contador.contadorSubject.subscribe(result => {
            this.contadorTotal = result;
        });

        this.produtos = this.contador.quantidadeProduto.pipe(
            map(quantidades => {
                return Object.keys(quantidades).map(key => ({
                    id: key,
                    quantidade: quantidades[key]
                }));
            })
        )

        this.produtos.subscribe(async result => {
            for (let i = 0; i < result.length; i++) {
                this.variavel_produto = result[i].id;
                this.variavel_produto_quantidade = result[i].quantidade;
                console.log("valor produto result.descricao ", this.variavel_produto);
                console.log("valor produto result.qauntidade: ", this.variavel_produto_quantidade);
                // this.obterDadosDoProduto(this.variavel_produto, this.variavel_produto_quantidade);
                // Aguarde a conclusão de obterId antes de chamar obterDadosDoProduto
                await this.obterId(this.variavel_produto);
                console.log("dentro do obterdados completos ", this.docId);

                // Chame obterDadosDoProduto somente se docId for definido
                if (this.docId !== "") {
                    await this.obterDadosDoProduto(this.variavel_produto, this.variavel_produto_quantidade);
                }
            }
        })
    }

    async obterId(descricao: string) {
        const q = query(collection(this.firestore, "produto_encomenda"), where("descricao", "==", descricao));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            this.docId = doc.id;
        });
    }
    
    async obterDadosDoProduto(descricao: string, quantidade: number) {
        if (this.docId !== "") {
            console.log("passei ", this.docId);
            const docInstance = doc(this.firestore, 'produto_encomenda', this.docId)
            const docSnap = await getDoc(docInstance);

            if (docSnap.exists()) {
                const idProduto = docSnap.id;
                console.log(idProduto);
                const nomeProduto = docSnap.get("descricao");
                console.log(nomeProduto);
                const valor_unitario = docSnap.get("valor_unitario");
                console.log(valor_unitario);
                const quantidade_produto = quantidade;
                console.log(quantidade_produto);
                const calculo = quantidade_produto * valor_unitario;
                this.resultado_calculo += calculo;
                this.valor_total = this.resultado_calculo;
                console.log(this.valor_total);
                const novoProduto: pedidoItem = {
                    id_produto: idProduto,
                    descricao_produto: nomeProduto,
                    quantidade_produto: quantidade_produto,
                    valor_unitario_produto: valor_unitario,
                    valor_total_pedido: this.valor_total
                };
                this.finalizar_pedido_produtos.push(novoProduto);
            } else {
                console.log("Doc não encontrado!");
            }
        }
    }

    encomendar() {
        this.finalizar_pedido_produtos.forEach((produto: pedidoItem) => {
            this.descricao.push(produto.descricao_produto);
            this.quantidade.push(produto.quantidade_produto);
            this.valor_unit.push(produto.valor_unitario_produto);
            this.valor_total_var = produto.valor_total_pedido;
        });

        const docRef = addDoc(collection(this.firestore, "pedido_item"), {
            produto_desc: this.descricao,
            valor_unit: this.valor_unit,
            quantidade: this.quantidade,
            valor_total: this.valor_total_var
        });
    }
}