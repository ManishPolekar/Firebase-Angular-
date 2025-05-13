import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { AccountComponent } from './Component/account/account.component';
import { LoginComponent } from './Component/account/login/login.component';
import { FormsModule } from '@angular/forms'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { firebaseConfig } from '../environment/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AccountComponent,
    LoginComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    MatToolbarModule
    
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
