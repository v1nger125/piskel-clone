import { Directive, ElementRef, Input, OnChanges  } from '@angular/core';

@Directive({
  selector: '[appFrameDraw]'
})
export class FrameDrawDirective implements OnChanges{

  @Input('appFrameDraw') arr: Array<Array<string>>;

  constructor(private el: ElementRef) {

  }

  ngOnChanges(){
    let ctx = this.el.nativeElement.getContext('2d');
    let size = this.arr.length;
    let step: number, scale: number;
    if (size <= ctx.canvas.clientWidth) {
      step = 1;
      scale = ctx.canvas.clientWidth/size;
    }
    else {
      scale = 1;
      step = size/ctx.canvas.clientWidth;
    }
    for (let i = 0; i < size; i+=step) {
      for (let j = 0; j < size; j+=step) {
        ctx.fillStyle = this.arr[i][j];
        ctx.fillRect(i*scale,j*scale, scale, scale);
      }
    }
  }
}
