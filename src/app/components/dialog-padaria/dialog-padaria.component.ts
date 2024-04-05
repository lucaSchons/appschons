import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-padaria',
    templateUrl: 'dialog-padaria.component.html',
    styleUrls: ['./dialog-padaria.component.scss']
})

export class DialogPadaria {
    constructor(@Inject(MAT_DIALOG_DATA) public produto: any) { }
}