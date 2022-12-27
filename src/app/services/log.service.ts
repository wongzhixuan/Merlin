import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { orderBy, query } from '@firebase/firestore';
import { first, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getUserLog() {
    const currentUser = this.auth.currentUser;
    const logRef = doc(this.firestore, `log/${currentUser.uid}`);
    return docData(logRef, { idField: 'id' }).pipe(first()).toPromise();
  }

  updateUserLog(userLog) {
    const currentUser = this.auth.currentUser;
    const logRef = doc(this.firestore, `log/${currentUser.uid}`);
    return setDoc(
      logRef,
      {
        videoLog: userLog.videoLog,
        readLog: userLog.readLog,
        assignmentLog: userLog.assignmentLog,
      },
      { merge: true }
    );
  }
}
