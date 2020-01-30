import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs'
import { FramesService } from '../frames.service';
import { SettingsService } from '../settings.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-frame-bar',
  templateUrl: './frame-bar.component.html',
  styleUrls: ['./frame-bar.component.css']
})
export class FrameBarComponent implements OnInit, OnDestroy {

  @ViewChild('framesParent', { static: true })
  framesParent: ElementRef;

  private settingsSubscription: Subscription;

  private size: number;

  current: number;

  localFrames = [];

  fps: number;

  animatedFrame: number = 0;

  constructor(private frames: FramesService,
    private settings: SettingsService) { }

  ngOnInit() {
    this.settingsSubscription = this.settings.getMessenger().subscribe(message => {
      this.size = message.selectedSize;
    });
    this.localFrames = this.frames.getAllFrames();
    this.settings.sendSettings();
    this.frames.addFrame(this.size);
    this.select(0);
  }


  ngOnDestroy(){
    this.settingsSubscription.unsubscribe();
  }

  delete(item){
    let index = this.localFrames.indexOf(item);
    this.frames.deleteFrame(index);
    if (this.localFrames.length === 0) {
      this.frames.addFrame(this.size);
    }
    this.select(index < this.current? --this.current:
      index == this.localFrames.length? --this.current :this.current);
  }

  copy(item){
    this.frames.copyFrame(item);
  }

  select(value){
    this.current = value;
    this.frames.sendMessage('select', this.current);
  }

  add(){
    this.frames.addFrame(this.size);
  }

  onDrop(event: CdkDragDrop<any>){
    if(event.currentIndex === event.previousIndex) {return;}
    this.frames.moveFrame(event.previousIndex,event.currentIndex);
    this.localFrames = this.frames.getAllFrames();
    this.select(event.currentIndex);
  }

  private animatedFrameChange(){
    this.animatedFrame >= this.localFrames.length - 1? this.animatedFrame = 0: this.animatedFrame++
  }

  private intervalLink;

  animate(){
    clearInterval(this.intervalLink);
    this.intervalLink = setInterval(() => this.animatedFrameChange(), 1000/this.fps);
  }
}
