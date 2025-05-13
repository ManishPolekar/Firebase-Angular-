import { Component } from '@angular/core';
import { 
  Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser, updatePassword, sendPasswordResetEmail, updateEmail, 
  reauthenticateWithCredential, EmailAuthProvider 
} from '@angular/fire/auth';
import { 
  Firestore, doc, setDoc, getDoc, updateDoc, deleteDoc
} from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLogin = true;
  isLoggedIn = false;
  isForgotPassword = false;
  loggedInUser: string | null = null;
  userId: string | null = null;

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  resetEmail: string = '';
  newPassword: string = '';
  newUsername: string = '';
  updateEmailValue: string = '';
  currentPassword: string = ''; // Required for re-authentication

  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.isForgotPassword = false;
  }

  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
  }

  async onSubmit() {
    if (this.isLogin) {
      await this.login();
    } else {
      await this.signUp();
    }
  }

  async signUp() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      this.userId = userCredential.user?.uid;

      if (this.userId) {
        const userDocRef = doc(this.firestore, `users/${this.userId}`);
        await setDoc(userDocRef, {
          id: this.userId,
          username: this.username,
          email: this.email
        });

        alert('Sign up successful! Please log in.');
        this.isLogin = true;
      }
    } catch (error: any) {
      alert(error.message);
    }
  }

  async login() {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.userId = userCredential.user?.uid;

      if (this.userId) {
        const userDocRef = doc(this.firestore, `users/${this.userId}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as { username?: string, email?: string };
          this.isLoggedIn = true;
          this.loggedInUser = userData.username || 'User';
          this.email = userData.email || '';
        }
      }
    } catch (error: any) {
      alert(error.message);
    }
  }

  async updateProfile() {
    if (!this.userId) return alert("User not found!");

    try {
      const userDocRef = doc(this.firestore, `users/${this.userId}`);
      await updateDoc(userDocRef, { username: this.newUsername });

      this.loggedInUser = this.newUsername;
      alert("Profile updated successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async changePassword() {
    if (!this.auth.currentUser) return alert("User not found!");

    try {
      await updatePassword(this.auth.currentUser, this.newPassword);
      alert("Password updated successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async updateEmail() {
    if (!this.auth.currentUser) return alert("User not found!");
    
    try {
      // Re-authenticate the user before updating the email
      const credential = EmailAuthProvider.credential(this.auth.currentUser.email as string, this.currentPassword);
      await reauthenticateWithCredential(this.auth.currentUser, credential);

      // Update the email in Firebase Authentication
      await updateEmail(this.auth.currentUser, this.updateEmailValue);

      // Update the email in Firestore
      const userDocRef = doc(this.firestore, `users/${this.userId}`);
      await updateDoc(userDocRef, { email: this.updateEmailValue });

      alert("Email updated successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async resetPassword() {
    if (!this.resetEmail) return alert("Please enter your email!");

    try {
      await sendPasswordResetEmail(this.auth, this.resetEmail);
      alert("Password reset link sent! Check your email.");
      this.toggleForgotPassword();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async deleteAccount() {
    if (!this.auth.currentUser) return alert("User not found!");

    try {
      await deleteDoc(doc(this.firestore, `users/${this.userId}`));
      await deleteUser(this.auth.currentUser);

      this.isLoggedIn = false;
      this.loggedInUser = null;
      alert("Account deleted successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async updateUserDetails() {
    if (!this.userId) return alert("User not found!");
  
    try {
      const userDocRef = doc(this.firestore, `users/${this.userId}`);
  
      // Update username
      if (this.newUsername.trim() !== "") {
        await updateDoc(userDocRef, { username: this.newUsername });
        this.loggedInUser = this.newUsername;
      }
  
      // Update email (use `this.updateEmail()` instead of `updateEmail()`)
      if (this.updateEmailValue.trim() !== "" && this.currentPassword.trim() !== "") {
        await this.updateEmail(); // ✅ Correct usage
      }
  
      alert("User details updated successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }
  async logout() {
    await signOut(this.auth);
    this.isLoggedIn = false;
    this.loggedInUser = null;
    alert('Logged out successfully!');
  }
}
