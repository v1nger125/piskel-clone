import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService{

  private settings = {
    selectedSize: 64,
    selectedTool: "pen",
    color: "#000000",
    prevColor: "#ffffff"
  };

  private subject = new Subject<any>();

  constructor() { }

  getMessenger(){
    return this.subject.asObservable();
  }

  public sendSettings(){
    this.subject.next(this.settings);
  }

  public setSettings(settings){
    this.settings = settings;
    this.sendSettings();
  }

  public setSize(size : number){
    this.settings.selectedSize = size;
    this.sendSettings();
  }

  public setTool(tool : string){
    this.settings.selectedTool = tool;
    this.sendSettings();
  }

  public setColor(color : string){
    this.settings.prevColor = this.settings.color;
    this.settings.color = color;
    this.sendSettings();
  }

}
