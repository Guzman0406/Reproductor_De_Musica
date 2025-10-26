import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../presentation/layouts/main-layout/main-layout.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: '<p>Home</p>',
  standalone: true
})
export class HomeComponent {}

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { 
        path: 'home', 
        component: HomeComponent
      },
      { 
        path: 'playlist/:id', 
        loadComponent: () => import('../presentation/pages/playlist/playlist.component').then(m => m.PlaylistComponent)
      },
    ]
  }
];
