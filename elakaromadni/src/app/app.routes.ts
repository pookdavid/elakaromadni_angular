
import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AdsComponent } from './components/ads/ads.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MessagesComponent } from './components/messages/messages.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddAdComponent } from './components/add-ad/add-ad.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ads', component: AdsComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-ad', component: AddAdComponent },
  { path: 'cars/:id', component: CarDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  
  { path: '**', redirectTo: '' }
];