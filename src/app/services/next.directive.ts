import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNext]'
})
export class NextDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click')
  nextFunc() {
    const elm = this.el.nativeElement.parentElement.children[0];
    const card = elm.querySelector(".item");

    if (card) {
      card.classList.add('animate');
  
      setTimeout(() => {
        card.classList.remove('animate');
        elm.append(card);
      }, 200);
    } else {
      console.log("Item não encontrado");
    }
  }

}
