import { Injectable, OnInit } from '@angular/core';
import { Firestore, collectionData, collectionGroup } from '@angular/fire/firestore';
import { collection, getDoc, doc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ProdutoEncomenda } from './produto-encomenda.model';
import { Produto } from './produto.model';
import { DialogPadaria } from './dialog-padaria/dialog-padaria.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  produtosEncomenda!: Observable<any>;
  produtos!: Observable<any>;

  constructor(private firestore: Firestore, public dialog: MatDialog) {
    const collectionInstance = collectionGroup(this.firestore, 'produto_encomenda');
    this.produtosEncomenda = collectionData(collectionInstance, { idField: 'id' });
    const collec = collection(this.firestore, 'produtos_padaria');
    collectionData(collec, { idField: 'id' }).subscribe(resul => {
      console.log(resul);
    })
    this.produtos = collectionData(collec, { idField: 'id' });
  }

  getProdutosEncomenda() {
    return this.produtosEncomenda;
  }

  getProdutos() {
    return this.produtos;
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

  getProduto(descricao: string): Observable<any[]> {
    const collectionInstance = collection(this.firestore, 'produto_encomenda');

    let resposta = query(collectionInstance, where('descricao', '==', descricao));
  
    return collectionData(resposta, { idField: 'id' });
  }
  
}