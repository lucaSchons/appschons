import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '../order.service';
import { ProdutoService } from '../produtos.service';
import { pedidoItem } from '../pedido-item.model';
import { ProdutoEncomenda } from '../produto-encomenda.model';

@Component({
    selector: 'app-padaria',
    templateUrl: './padaria.component.html',
    styleUrls: ['./padaria.component.scss']
})

export class PadariaComponent implements OnInit {
    produtos!: Observable<any>;
    descricao!: string;
    imageUrl!: string;
    produtosEncomenda!: Observable<any>;
    quantidade_produto_service!: Observable<any>;

    constructor(public orderService: OrderService, public produtoService: ProdutoService) { }

    ngOnInit() {
        this.produtosEncomenda = this.produtoService.getProdutosEncomenda();
        this.produtos = this.produtoService.getProdutos();
    }

    getOrderQuantity(produto: string) {  
        let quantidades;
        const quantidadeStorage = localStorage.getItem('@schons');
       
        if (quantidadeStorage !== null) {
            const quantidadeObj = JSON.parse(quantidadeStorage);
            let descricao_produto = "";
            quantidadeObj.forEach((item: { items: { produto: any; }; }) => {
                descricao_produto = item.items.produto[0].descricao_produto;
                if(descricao_produto === produto){
                    const quant = item.items.produto[0].quantity;
                    quantidades = quant;
                }
            });

        } else {
            quantidades = 0;
        }

        return quantidades;
    }
}
