import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'
import { FramesService } from '../frames.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-working-section',
  templateUrl: './working-section.component.html',
  styleUrls: ['./working-section.component.css']
})
export class WorkingSectionComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx;

  private frameSubscription: Subscription;
  private settingsSubscription: Subscription;

  private canvasSize: number;
  private pixelSize: number;
  private tool: string;
  private color: string;

  private currentImageArr;
  private currentElement: number;

  constructor(private frames: FramesService,
    private settings:  SettingsService) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.frameSubscription = this.frames.getMessenger().subscribe(message => {
      switch(message.type) {
        case 'select': {
          this.currentElement = message.value;
          this.currentImageArr = this.frames.getFrame(this.currentElement);
          this.updateCanvas();
        }
        break;
        case 'resize': {
          this.currentImageArr = this.frames.getFrame(this.currentElement);
          this.updateCanvas();
        }
        break;
      }
    });

    this.settingsSubscription = this.settings.getMessenger().subscribe(message => {
      this.canvasSize = message.selectedSize;
      this.pixelSize = this.ctx.canvas.clientWidth/this.canvasSize;
      this.color = message.color;
      this.tool = message.selectedTool;
    });
  }

  ngOnDestroy() {
    this.frameSubscription.unsubscribe();
    this.settingsSubscription.unsubscribe();
  }

  private _checkTrust(x, y){
    return (x >= 0 && x < this.canvasSize && y >= 0 && y < this.canvasSize);
  }

  private pickColor(clX,clY){
    let x = Math.floor(clX/this.pixelSize);
    let y = Math.floor(clY/this.pixelSize);
    if(this._checkTrust(x, y)) {
      this.settings.setColor(this.currentImageArr[x][y]);
    }
  }

  private setPixelColor(clX,clY, pixelColor){
    let x = Math.floor(clX/this.pixelSize);
    let y = Math.floor(clY/this.pixelSize);
    if (this.currentImageArr[x][y] === pixelColor || !this._checkTrust(x, y)) {return;}
    this.currentImageArr[x][y] = pixelColor;
    this.ctx.fillStyle = pixelColor;
    this.ctx.fillRect(x*this.pixelSize, y*this.pixelSize, this.pixelSize, this.pixelSize);
  }

  private updateCanvas(){
    for (let i = 0; i < this.canvasSize; i++) {
      for (let j = 0; j < this.canvasSize; j++) {
        this.ctx.fillStyle = this.currentImageArr[i][j];
        this.ctx.fillRect(i*this.pixelSize,j*this.pixelSize, this.pixelSize, this.pixelSize);
      }
    }
  }

  //fill all pixel with the same color
  private magicFillArea(clX,clY){
    let x = Math.floor(clX/this.pixelSize);
    let y = Math.floor(clY/this.pixelSize);
    if (this.currentImageArr[x][y] === this.color || !this._checkTrust(x, y)) return;
    let oldColor = this.currentImageArr[x][y];
    for (let i = 0; i < this.canvasSize; i++) {
      for (let j = 0; j < this.canvasSize; j++) {
        if(oldColor === this.currentImageArr[i][j]){
          this.currentImageArr[i][j] = this.color;
          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(i*this.pixelSize,j*this.pixelSize, this.pixelSize, this.pixelSize);
        }
      }
    }
  }

  private fillArea(clX,clY){
    let x = Math.floor(clX/this.pixelSize);
    let y = Math.floor(clY/this.pixelSize);
    if (this.currentImageArr[x][y] === this.color || !this._checkTrust(x, y)) return;
    this._fillAreaHelper(x, y, this.currentImageArr[x][y]);
    this.updateCanvas();
  }

  private _fillAreaHelper(x,y, oldColor){
    if (oldColor === this.color) return;
    let startX = x;
    let arrX = new Array();
    while (this._checkTrust(x, y) && this.currentImageArr[x][y] === oldColor) {
      this.currentImageArr[x][y] = this.color;
      arrX.push(x);
      x++;
    }
    x = startX - 1;
    while (this._checkTrust(x, y) && this.currentImageArr[x][y] === oldColor) {
      this.currentImageArr[x][y] = this.color;
      arrX.push(x);
      x--;
    }
    arrX.forEach((item) => {this._fillAreaHelper(item, y + 1, oldColor)});
    arrX.forEach((item) => {this._fillAreaHelper(item, y - 1, oldColor)});
  }

  private getXY(e: MouseEvent){
    let x = e.offsetX + this.ctx.canvas.clientLeft;
    let y = e.offsetY + this.ctx.canvas.clientTop;
    if (x < 0) x = 0;
    else if (x >= this.ctx.canvas.clientWidth) x = this.ctx.canvas.clientWidth-1;
    if (y < 0) y = 0;
    else if (y >= this.ctx.canvas.clientHeight) y = this.ctx.canvas.clientHeight-1;
    return [x, y];
  }

  private drawLine(x_1, y_1, x_2, y_2, drawColor) {
    let step = true;
    if(Math.abs(x_1 - x_2) < Math.abs(y_1 - y_2)){
      step = false;
      [x_2, y_2] = [y_2, x_2];
      [x_1, y_1] = [y_1, x_1];
    }
    if (x_1 > x_2){
      [x_2, x_1] = [x_1, x_2];
      [y_1, y_2] = [y_2, y_1];
    }
    const dx = x_2-x_1;
    const dy = Math.abs(y_2-y_1);
    let y = y_1;
    let error = 0;
    for (let i = x_1; i <= x_2; i++) {
      if(step){
        this.setPixelColor(i,y, drawColor)
      }
      else{
        this.setPixelColor(y,i, drawColor);
      }
      error += dy;
      if (error > dx){
        y += y_1  >y_2 ? -1 : 1;
        error -= dx;
      }
    }
  }

  clickAct(e: MouseEvent){
    let [x, y] = this.getXY(e);
    if (this.tool === 'picker') {
      this.pickColor(x, y);
    }
    else if (this.tool === 'pen') {
      this.setPixelColor(x, y, this.color);
    }
    else if (this.tool === 'eraser') {
      this.setPixelColor(x, y, "#ffffff");
    }
    else if (this.tool === 'bucket') {
      this.fillArea(x, y);
    }
    else if(this.tool === 'mBucket') {
      this.magicFillArea(x, y);
    }
    this.frames.setFrame(this.currentImageArr, this.currentElement);
  }

  mouseDownAct(e: MouseEvent){
    let [x, y] = this.getXY(e);
    let cnv = this.canvas.nativeElement;
    if (this.tool === 'pen') {
      let eventDrawLine = (e: MouseEvent) => {
        let [newX, newY] = this.getXY(e);
        if (newX !== x || newY !== y) {
          this.drawLine(x, y, newX, newY, this.color);
          x = newX;
          y = newY;
        }
      }
      cnv.addEventListener("mousemove", eventDrawLine);
      cnv.onmouseup = () => {
        cnv.removeEventListener("mousemove", eventDrawLine);
        cnv.onmouseup = null;
      }
      cnv.onmouseleave = () => {
        cnv.removeEventListener("mousemove", eventDrawLine);
        cnv.onmouseleave = null;
        this.frames.setFrame(this.currentImageArr, this.currentElement);
      }
    }
    else if (this.tool === 'eraser') {
      let eventDrawLine = (e: MouseEvent) => {
        let [newX, newY] = this.getXY(e);
        if (newX !== x || newY !== y) {
          this.drawLine(x, y, newX, newY, "#ffffff");
          x = newX;
          y = newY;
        }
      }
      cnv.addEventListener("mousemove", eventDrawLine);
      cnv.onmouseup = () => {
        cnv.removeEventListener("mousemove", eventDrawLine);
        cnv.onmouseup = null;
      }
      cnv.onmouseleave = () => {
        cnv.removeEventListener("mousemove", eventDrawLine);
        cnv.onmouseleave = null;
        this.frames.setFrame(this.currentImageArr, this.currentElement);
      }
    }
    else if (this.tool === 'stroke'){
      let buffer = JSON.parse(JSON.stringify([...this.currentImageArr]));
      let eventDrawLine = (e: MouseEvent) => {
        let [newX, newY] = this.getXY(e);
        if (newX !== x || newY !== y) {
          this.currentImageArr = JSON.parse(JSON.stringify([...buffer]));
          this.updateCanvas();
          this.drawLine(x, y, newX, newY, this.color);
        }
      }
      cnv.addEventListener("mousemove", eventDrawLine);
      cnv.onmouseup = () => {
        cnv.removeEventListener("mousemove", eventDrawLine);
        cnv.onmouseup = null;
      }
      cnv.onmouseleave = () => {
        cnv.removeEventListener("mousemove", eventDrawLine);
        cnv.onmouseleave = null;
        this.frames.setFrame(this.currentImageArr, this.currentElement);
      }
    }
  }
}
