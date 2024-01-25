import { Produto } from './../produto.model';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore'
import { Observable} from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { DialogPadaria } from '../dialog-padaria/dialog-padaria.component';
import { getDocs } from 'firebase/firestore';
import { ContadorService } from '../contador.service';
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
    
    constructor(private firestore: Firestore, public contadorService: ContadorService, public produtoService: ProdutoService) {}
    
    ngOnInit() {
        this.produtosEncomenda = this.produtoService.getProdutosEncomenda();
        this.produtos = this.produtoService.getProdutos();
    }

    getQuantidadeProduto(descricao: string){
        let quantidades;
        const quantidadeStorage = localStorage.getItem('@schons');
        if (quantidadeStorage !== null) {
            const quantidadeObj = JSON.parse(quantidadeStorage);
            quantidades = quantidadeObj[descricao];
            
        }else{
            quantidades = 0;
        }
        return quantidades;
    }
}