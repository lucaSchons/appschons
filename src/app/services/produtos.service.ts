import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Observable} from 'rxjs';
import { Produto } from '../produto.model';
import { DialogPadaria } from '../components/dialog-padaria/dialog-padaria.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  produtosEncomenda!: Observable<any>;
  produtos!: Observable<any>;

  constructor(private firestore: Firestore, public dialog: MatDialog) {
    const collectionProdutoEncomenda = collection(this.firestore, 'produto_encomenda');
    collectionData(collectionProdutoEncomenda, { idField: 'id' }).subscribe({ });
    this.produtosEncomenda = collectionData(collectionProdutoEncomenda, { idField: 'id' });

    const collectionProduto = collection(this.firestore, 'produtos_padaria');
    collectionData(collectionProduto, { idField: 'id' }).subscribe({ });
    this.produtos = collectionData(collectionProduto, { idField: 'id' });
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