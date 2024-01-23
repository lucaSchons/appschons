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
        const collectionInstance = collectionGroup(this.firestore, 'produto_encomenda');
        this.produtosEncomenda = collectionData(collectionInstance, { idField: 'id' });
        const collec = collection(this.firestore, 'produtos_padaria');
        collectionData(collec, { idField: 'id' }).subscribe(resul => {
            console.log(resul);
        })
        this.produtos = collectionData(collec, { idField: 'id' });
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

    incrementa(descricao: string) {
        this.contadorService.incrementar(descricao);
    }

    decrementa(descricao: string){
        this.contadorService.decrementar(descricao);
    }
}