import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appPrev]'
})
export class PrevDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click')
  prevFunc() {
    const elm = this.el.nativeElement.parentElement.children[0];
    const items = elm.querySelectorAll('.item');

    if (items.length > 0) {
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      
      elm.insertBefore(lastItem, firstItem);
      lastItem.classList.add('animate');

      setTimeout(() => {
        lastItem.classList.remove('animate');
      }, 200);
    } else {
      console.log("Item não encontrado");
    }
  
  }
  
}
