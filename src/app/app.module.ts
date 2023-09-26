import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DeleteComponent } from './components/delete/delete.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { AboutComponent } from './components/about/about.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SingleNoteComponent } from './components/single-note/single-note.component';
import { DescendingPipe } from './pipes/descending.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DeleteComponent,
    ArchiveComponent,
    AboutComponent,
    SettingsComponent,
    SingleNoteComponent,
    DescendingPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
