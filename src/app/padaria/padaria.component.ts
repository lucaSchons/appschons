import { ProdutoEncomenda } from './../produto-encomenda.model';
import { Produto } from './../produto.model';
import { Component } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where } from '@angular/fire/firestore'
import { Observable, filter, map } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogPadaria } from '../dialog-padaria/dialog-padaria.component';
import { addDoc, collectionGroup, getDocs } from 'firebase/firestore';
import { ContadorService } from '../contador.service';

@Component({
    selector: 'app-padaria',
    templateUrl: './padaria.component.html',
    styleUrls: ['./padaria.component.scss']
})

export class PadariaComponent {
    produtos!: Observable<any>;
    descricao!: string;
    imageUrl!: string;
    produtosEncomenda!: Observable<any>;
    quantidade_produto_service!: Observable<any>;
    
    constructor(public dialog: MatDialog, private firestore: Firestore, public contadorService: ContadorService) {
        this.getData();
        const collectionInstance = collectionGroup(this.firestore, 'produto_encomenda');
        this.produtosEncomenda = collectionData(collectionInstance, { idField: 'id' });
    }

    async openDialog(produto: Produto) {
        const collectionInstance = collection(this.firestore, 'produtos_padaria');
        const q = query(collectionInstance, where("descricao", "==", produto.descricao));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            this.dialog.open(DialogPadaria, {
                data: {
                    id: doc.get("id"),
                    descricao: doc.get("descricao"),
                    imageUrl: doc.get("imageUrl"),
                    data_disponivel: doc.get("data_disponivel"),
                }
            });
        });
    }

    getQuantidadeProduto(id: string): number {
        let quant_variavel = 0;
        const quantidadeProduto = this.contadorService.quantidadeProduto;
    
        quantidadeProduto.pipe(
          map(quantidades => quantidades[id] || 0)
        ).subscribe(result => {
            quant_variavel = result;
        })

        return quant_variavel;
    }

    getData() {
        const collectionInstance = collection(this.firestore, 'produtos_padaria');
        collectionData(collectionInstance, { idField: 'id' }).subscribe(resul => {
            console.log(resul);
        })
        this.produtos = collectionData(collectionInstance, { idField: 'id' });
    }

    incrementa(id: string) {
        this.contadorService.incrementar(id);
    }

    decrementa(id: string){
        this.contadorService.decrementar(id);
    }

}
