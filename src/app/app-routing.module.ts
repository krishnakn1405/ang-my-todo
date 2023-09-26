import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DeleteComponent } from './components/delete/delete.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { AboutComponent } from './components/about/about.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SingleNoteComponent } from './components/single-note/single-note.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'delete', component: DeleteComponent},
  { path: 'archive', component: ArchiveComponent},
  { path: 'about', component: AboutComponent},
  { path: 'single-note', component: SingleNoteComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
