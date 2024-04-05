import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  linkWhatsApp: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogComponent) {
    this.linkWhatsApp = data;
  }

  enviarparawhats(){
    window.location.href = this.linkWhatsApp;
  }

}
