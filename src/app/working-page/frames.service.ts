import { Injectable} from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FramesService {

  frames: Array<Array<Array<string>>> = [];

  private subject = new Subject<any>();

  constructor() { }

  getMessenger(){
    return this.subject.asObservable();
  }

  sendMessage(type: string, value: number){
    this.subject.next({type: type, value: value});
  }

  public addFrame(size: number){
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
      arr[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        arr[i][j] = "#ffffff";
      }
    }
    this.frames.push(arr);
  }

  public copyFrame(frame){
    this.frames.push(JSON.parse(JSON.stringify([...frame])));
  }

  public resize(size: number){
    let dif = size - this.frames[0].length;
    if (dif > 0){
      this.frames.forEach(element => {
        element.forEach(row => {
          row.push(...Array(dif).fill("#ffffff"));
        });
        let arr = new Array(dif);
        for (let i = 0; i < dif; i++) {
          arr[i] = new Array(size);
          for (let j = 0; j < size; j++) {
            arr[i][j] = "#ffffff";
          }
        }
        element.push(...arr);
      });
    }
    else {
      dif = -dif;
      this.frames.forEach(function(element){
        element.splice(size, dif);
        element.forEach(row => {
          row.splice(size, dif);
        });
      });
    }
    this.sendMessage('resize', -1);
  }

  public getFrame(num: number){
    return this.frames[num];
  }

  public setFrame(frame: Array<Array<string>>, num: number) {
    this.frames[num] = JSON.parse(JSON.stringify([...frame]));
    this.sendMessage('set', num);
  }

  public deleteFrame(num: number){
    this.frames.splice(num, 1);
  }

  public moveFrame(from:number, to: number){
    let target = this.frames.splice(from, 1);
    let tail;
    tail = this.frames.splice(to, this.frames.length);
    this.frames.push(...target);
    this.frames.push(...tail);
  }

  getAllFrames(){
    return this.frames;
  }
}
