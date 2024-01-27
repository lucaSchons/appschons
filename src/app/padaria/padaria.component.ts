import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '../order.service';
import { ProdutoService } from '../produtos.service';

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

    getOrderQuantity(descricaoProduto: string): number {
        const order = this.orderService.orderSubject.value;
        const produto = order.find(item => item.descricao_produto === descricaoProduto);

        return produto ? produto.quantidade_produto : 0;
    }
}