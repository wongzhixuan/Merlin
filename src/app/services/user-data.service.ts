import { Injectable } from '@angular/core';
import { Auth, updateProfile } from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { addDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../modal/user';
import { Photo } from '@capacitor/camera';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  countries: any[] = [];
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private storage: Storage,
    private http: HttpClient
  ) {}

  createProfile(user: User) {
    const currentUser = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${currentUser.uid}`);
    return setDoc(userDocRef, {
      username: user.username,
      school: user.school,
      countryflag: user.countryflag,
      nationality: user.nationality,
      gender: user.gender,
      points: user.points,
      role: user.role,
      imageUrl: ''
    });
  }

  getProfile() {
    const user = this.auth.currentUser;
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userRef, { idField: 'id' });
  }

  deleteProfile(id: string) {
    const userRef = doc(this.firestore, `users/${id}`);
    return deleteDoc(userRef);
  }

  updateUserProfile(userData: User) {
    const user = this.auth.currentUser;
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return updateDoc(userRef, {
      username: userData.username,
      school: userData.school,
      countryflag: userData.countryflag,
      nationality: userData.nationality,
      gender: userData.gender,
    });
  }

  updateUserImage(){
    const user = this.auth.currentUser;
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return updateDoc(userRef, {
      imageUrl:user.photoURL
    });
  }

  updatePoints(id: string, newPoint: number) {
    const userRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userRef, { points: newPoint });
  }

  async uploadImage(cameraFile: Photo){
    const user = this.auth.currentUser;
    const path = `users/${user.uid}/profile.jpg`;
    const storageRef = ref(this.storage, path);

    try{
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        imageUrl
      });
      updateProfile(user, {photoURL: imageUrl}).then(()=>{

      });
      return true;
    }
    catch(e){
      return null;
    }
  }

  async getCountries(){
    return this.http.get('https://restcountries.com/v3.1/all').toPromise();
  }

}

export class CountryData{
  name: string;
  flag: string;
}
