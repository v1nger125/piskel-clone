import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'

import { SettingsService } from '../settings.service';
import { FramesService } from '../frames.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit{

  size: number;
  tool: string;
  color: string;
  prevColor: string;

  private subscription: Subscription;

  constructor(private settings: SettingsService,
    private frames: FramesService) { }

  ngOnInit() {
    this.subscription = this.settings.getMessenger().subscribe(message => {
      this.tool = message.selectedTool;
      this.size = message.selectedSize;
      this.color = message.color;
      this.prevColor = message.prevColor;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeSize(value: number){
    if (this.size == value) {return;}
    this.settings.setSize(value);
    this.frames.resize(value);
  }
  changeTool(value: string){
    if (this.tool == value) {return;}
    this.settings.setTool(value);
  }
  changeColor(value: string){
    this.settings.setColor(value);
  }
}
