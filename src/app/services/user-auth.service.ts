import { Injectable } from '@angular/core';
import {
  Auth,
  AuthCredential,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../modal/user';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(private auth: Auth, private router: Router) {}

  async register({ email, password }) {
    try {
      let user;
      await createUserWithEmailAndPassword(this.auth, email, password).then(
        (val) => (user = val.user)
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }

  async resetPassword(email) {
    return await sendPasswordResetEmail(this.auth, email, {
      url: 'http://localhost:8100/auth/recover-password',
    });
  }

  getUser() {
    return this.auth.currentUser;
  }

  updateUserProfile(user: User) {
    return updateProfile(this.auth.currentUser, {
      displayName: user.username,
      photoURL: user.photoUrl,
    });
  }

  async changePassword(password: string) {
    try {
      await updatePassword(this.auth.currentUser, password);
      return this.auth.currentUser;
    } catch (e) {
      return null;
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    const credential = EmailAuthProvider.credential(
      this.auth.currentUser.email,
      password
    );
    return await reauthenticateWithCredential(this.auth.currentUser, credential)
      .then(() => true)
      .catch(() => false);
  }
}
