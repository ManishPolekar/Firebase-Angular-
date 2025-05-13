import { Component,OnInit , inject} from '@angular/core';
import {Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'firebase';

  auth = inject(Auth);

  ngOnInit() {
    console.log('✅ Firebase Auth initialized:', this.auth);
  }
}
