import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdsComponent } from './components/ads/ads.component';
import { AddAdComponent } from './components/add-ad/add-ad.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MessageListComponent } from './components/messages/message-list/message-list.component';
import { MessageConversationComponent } from './components/messages/message-conversation/message-conversation.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ads', component: AdsComponent },
  { path: 'add-ad', component: AddAdComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessageListComponent, canActivate: [AuthGuard] },
  { path: 'messages/:receiverId/:adId', component: MessageConversationComponent, canActivate: [AuthGuard] },
  { path: 'cars/:id', component: CarDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: '**', redirectTo: '' }
];