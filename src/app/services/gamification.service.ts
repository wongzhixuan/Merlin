import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { orderBy, query } from '@firebase/firestore';
import { first, tap } from 'rxjs/operators';
import { Achievement, Badge } from '../modal/gamification';
import { Storage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root',
})
export class GamificationService {
  badgeList = [];
  acList = [];
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private storage: Storage,
    private http: HttpClient
  ) {}

  getBadges() {
    this.badgeList = [];
    const badgeRef = collection(this.firestore, `badges`);
    const queryRef = query(badgeRef, orderBy('badgeId'));
    return collectionData(queryRef, { idField: 'id' })
      .pipe(
        tap((data) => {
          data.forEach((el) => {
            const badge: Badge = new Badge();
            badge.id = el.id;
            badge.badgeName = el.badgeName;
            badge.badgeDescription = el.badgeDescription;
            badge.badgeUrl = el.badgeUrl;
            badge.badgeId = el.badgeId;
            badge.badgeUrlGrey = el.badgeUrlGrey;
            this.badgeList.push(badge);
          });
        }),
        first()
      )
      .toPromise();
  }

  getBadgeStatus() {
    const user = this.auth.currentUser;
    const badgeRef = collection(this.firestore, `users/${user.uid}/badges`);
    return collectionData(badgeRef, { idField: 'id' })
      .pipe(first())
      .toPromise();
  }

  updateBadgeStatus(badgeDocId, badge){
    const user = this.auth.currentUser;
    const badgeRef = doc(this.firestore, `users/${user.uid}/badges/${badgeDocId}`);
    return setDoc(badgeRef, {
      badgeId: badge.badgeId,
      badgeStatus: badge.badgeStatus
    }, {merge: true});
  }

  checkBadgeStatus(badgeDocId){
    const user = this.auth.currentUser;
    const badgeRef = doc(this.firestore, `users/${user.uid}/badges/${badgeDocId}`);

    return docData(badgeRef, { idField: 'id' })
      .pipe(first())
      .toPromise();
  }

  getAchievements(){
    const acRef = collection(this.firestore, `achievements`);
    const queryRef = query(acRef, orderBy('acId'));
    return collectionData(queryRef, {idField: 'id'}).pipe(tap((data) => {
      data.forEach((el) => {
        const achievement = new Achievement();
        achievement.id = el.id;
        achievement.acId = el.acId;
        achievement.acName = el.acName;
        achievement.acPoints = el.acPoints;
        this.acList.push(achievement);
      });
    }),
    first()
  )
  .toPromise();
  }

  getAchievementStatus(){
    const user = this.auth.currentUser;
    const acRef = collection(this.firestore, `users/${user.uid}/achievements`);
    return collectionData(acRef, { idField: 'id' })
      .pipe(first())
      .toPromise();
  }

  checkAchievementStatus(acDocId){
    const user = this.auth.currentUser;
    const acRef = doc(this.firestore, `users/${user.uid}/achievements/${acDocId}`);

    return docData(acRef, { idField: 'id' })
      .pipe(first())
      .toPromise();
  }

  updateAchievementStatus(acDocId, achievement){
    const user = this.auth.currentUser;
    const acRef = doc(this.firestore, `users/${user.uid}/achievements/${acDocId}`);
    return setDoc(acRef, {
      acId: achievement.acId,
      acStatus: achievement.acStatus,
      acReceiveStatus: achievement.acReceiveStatus
    }, {merge: true});
  }

  updatePoints(newPoint: number) {
    const user = this.auth.currentUser;
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userRef, { points: newPoint }, {merge: true});
  }
}
