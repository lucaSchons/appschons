import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { ProdutoService } from '../../services/produtos.service';
import { pedidoItem } from '../../pedido-item.model';

@Component({
    selector: 'app-padaria',
    templateUrl: './padaria.component.html',
    styleUrls: ['./padaria.component.scss']
})

export class PadariaComponent implements OnInit {
    @ViewChild('containerEncomenda') containerEncomenda!: ElementRef;

    produtos!: Observable<any>;
    produtosEncomenda!: Observable<any>;
    imageObject: any[] = [];

    constructor(public orderService: OrderService, public produtoService: ProdutoService, private renderer: Renderer2) { }

    addProductToCart(event: MouseEvent, imageUrl: string, index: number) {
        const imgElement = this.createFlyImage(event, imageUrl);
        this.animateFlyImage(imgElement, event);
    }

    private createFlyImage(event: MouseEvent, imageUrl: string): HTMLElement {
        const img = this.renderer.createElement('img');
        img.src = imageUrl;
        this.renderer.setStyle(img, 'width', '50px');
        this.renderer.setStyle(img, 'height', '50px');
        this.renderer.setStyle(img, 'position', 'fixed');
        this.renderer.setStyle(img, 'z-index', '1000');

        const startRect = (event.target as HTMLElement).getBoundingClientRect();
        this.renderer.setStyle(img, 'top', `${startRect.top}px`);
        this.renderer.setStyle(img, 'left', `${startRect.left}px`);

        document.body.appendChild(img);
        return img;
    }

    private animateFlyImage(img: HTMLElement, event: MouseEvent) {
        const shopping_cart = document.querySelector('#shopping'); 
        if (!shopping_cart) {
            console.error('error');
            return;
        }
        const shopping_cart_pos = shopping_cart.getBoundingClientRect();
        const flying_img_pos = (event.target as HTMLElement).getBoundingClientRect();
        img.style.setProperty('--end-x', `${shopping_cart_pos.x}px`);
        this.renderer.addClass(img, 'fly-to-cart');
        img.addEventListener('animationend', () => {
            img.remove();
        });

    }

    ngOnInit() {
        this.produtosEncomenda = this.produtoService.getProdutosEncomenda();
        this.produtos = this.produtoService.getProdutos();
        this.produtosEncomenda.subscribe(produtos => {
            this.orderService.isSelect_buttonAdd = produtos.map(() => true);
            this.orderService.isSelect_button = produtos.map(() => false);
        });

        const produtosLocalStorage = localStorage.getItem('@schons');

        if (produtosLocalStorage !== null) {
            const objeto = JSON.parse(produtosLocalStorage);
            const instancia = objeto;
            if (objeto.length > 0) {
                this.orderService.orderSubject.next(objeto);
            }
            if (instancia !== undefined) {
                const quantidadesMaioresQueZero = objeto.filter((item: pedidoItem) =>
                    item.items.produto.some(p => p.quantity > 0)

                );
                this.produtosEncomenda.subscribe(res => {
                    quantidadesMaioresQueZero.forEach((item: { items: { produto: { descricao: any; }[]; }; }) => {
                        const descricao = item.items.produto[0].descricao;
                        const index = res.findIndex((produto: any) => produto.descricao === descricao);
                        this.orderService.isSelect_buttonAdd[index] = false;
                        this.orderService.isSelect_button[index] = true;
                    });
                });
            }
        }
    }

    getOrderQuantity(produto: string) {
        let quantidades;
        const quantidadeStorage = localStorage.getItem('@schons');

        if (quantidadeStorage !== null) {
            const quantidadeObj = JSON.parse(quantidadeStorage);
            let descricao_produto = "";
            quantidadeObj.forEach((item: { items: { produto: any; }; }) => {
                descricao_produto = item.items.produto[0].descricao;
                if (descricao_produto === produto) {
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
