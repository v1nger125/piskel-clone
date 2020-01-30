import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { WorkingPageComponent } from './working-page/working-page.component';
import { ToolBarComponent } from './working-page/tool-bar/tool-bar.component';
import { FrameBarComponent } from './working-page/frame-bar/frame-bar.component';
import { WorkingSectionComponent } from './working-page/working-section/working-section.component';
import { StartPageComponent } from './start-page/start-page.component';
import { FrameDrawDirective } from './working-page/frame-bar/frame-draw.directive';
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    WorkingPageComponent,
    ToolBarComponent,
    FrameBarComponent,
    WorkingSectionComponent,
    StartPageComponent,
    FrameDrawDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
