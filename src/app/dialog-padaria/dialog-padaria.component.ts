import { Produto } from './../produto.model';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Firestore, collection, collectionData, doc } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { PadariaComponent } from '../padaria/padaria.component';


@Component({
    selector: 'dialog-padaria',
    templateUrl: 'dialog-padaria.component.html',
    styleUrls: ['./dialog-padaria.component.scss']
})

export class DialogPadaria {

    constructor(@Inject(MAT_DIALOG_DATA) public produto: any) {
        console.log("entrei no dialog: ", produto.descricao)
        
    }
}