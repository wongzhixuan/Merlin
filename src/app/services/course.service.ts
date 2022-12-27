import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  collectionSnapshots,
  doc,
  docData,
  DocumentData,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Auth, updateProfile } from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
  uploadString,
} from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { finalize, first, tap } from 'rxjs/operators';
import {
  Assignment,
  CourseData,
  EnrollData,
  LecturerData,
  LessonData,
  Material,
  Reference,
  ToolData,
} from '../modal/course';
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  public currentCourse = null;
  public courseList = [];
  public lecturerList = [];
  public enrollList = [];
  public recentCourses = [];
  public myCourses = [];
  public allCourses = [];
  public lessonList = [];
  public assignmentList = [];
  public currentAssignment = null;
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private storage: Storage,
    private http: HttpClient
  ) {}

  getCurrentCourse() {
    return this.currentCourse;
  }

  setCurrentCourse(course) {
    this.currentCourse = course;
  }

  getCurrentAssignment() {
    return this.currentAssignment;
  }

  setCurrentAssignment(assignment) {
    this.currentAssignment = assignment;
  }

  getAllCourseList() {
    return this.allCourses;
  }

  setAllCourseList(courses) {
    this.allCourses = courses;
  }

  getMyCourseList() {
    return this.myCourses;
  }

  setMyCourseList(courses) {
    this.myCourses = courses;
  }

  getRecentCourseList() {
    return this.recentCourses;
  }

  setRecentCourseList(courses) {
    this.recentCourses = courses;
  }

  setCourseList(courses) {
    this.courseList = courses;
  }

  setEnrollList(enrolls) {
    this.enrollList = enrolls;
  }

  getEnrollListData() {
    return this.enrollList;
  }

  setLecturerList(lecturers) {
    this.lecturerList = lecturers;
  }

  getCourseList() {
    const courseRef = collection(this.firestore, `courses`);
    return collectionData(courseRef, { idField: 'id' })
      .pipe(
        tap((data) => {
          this.courseList = [];
          data.forEach((el) => {
            const courseData: CourseData = new CourseData();
            courseData.categoryId = el.categoryId;
            courseData.courseId = el.courseId;
            courseData.lecturerId = el.lecturerId;
            courseData.courseName =
              el.courseName !== undefined ? el.courseName : '';
            courseData.courseDescription =
              el.courseDescription !== undefined ? el.courseDescription : '';
            courseData.credit = el.credit !== undefined ? el.credit : 0;
            courseData.imageUrl = el.imageUrl !== undefined ? el.imageUrl : '';
            if (el.tools) {
              courseData.tools = [];
              for (const tool of el.tools) {
                const thisTool: ToolData = new ToolData();

                thisTool.toolName =
                  tool.toolName !== undefined ? tool.toolName : '';
                thisTool.toolImgUrl =
                  tool.toolImgUrl !== undefined ? tool.toolImgUrl : '';
                courseData.tools.push(thisTool);
              }
            }
            this.courseList.push(courseData);
          });
        }),
        first()
      )
      .toPromise();
  }

  getLessons(id) {
    const lessonRef = collection(this.firestore, `courses/${id}/lessons`);
    const queryRef = query(lessonRef, orderBy('order'));
    return collectionData(queryRef)
      .pipe(
        tap((data) => {
          this.lessonList = [];
          data.forEach((el: LessonData) => {
            const lessonData: LessonData = new LessonData();
            lessonData.lessonId = el.lessonId;
            lessonData.order = el.order !== undefined ? el.order : -1;
            lessonData.title = el.title !== undefined ? el.title : '';
            lessonData.materials = [];
            let tempMaterials = [];
            el.materials.forEach((mat: Material) => {
              const material: Material = new Material();
              material.createdDate =
                mat.createdDate !== undefined ? mat.createdDate : null;
              material.materialId = mat.materialId;
              material.description =
                mat.description !== undefined ? mat.description : '';
              material.order = mat.order !== undefined ? mat.order : -1;
              material.type = mat.type !== undefined ? mat.type : -1;
              material.url = mat.url !== undefined ? mat.url : '';
              tempMaterials.push(material);
            });
            tempMaterials = tempMaterials.sort((a, b) => a.order - b.order);
            lessonData.materials = tempMaterials;
            this.lessonList.push(lessonData);
          });
        }),
        first()
      )
      .toPromise();
  }


  getEnrollList(): Promise<DocumentData[]> {
    const user = this.auth.currentUser;
    const thisRef = collection(this.firestore, `users/${user.uid}/courses`);
    const queryRef = query(thisRef, orderBy('lastVisit', 'desc'));
    // collectionSnapshots(queryRef)
    //   .pipe(
    //     tap((snapshots) => {
    //       snapshots.forEach((snapshot) => {
    //         const el = snapshot.data();
    //         const enrolData: EnrollData = new EnrollData();
    //         enrolData.courseId = el.courseId;
    //         enrolData.lastVisit = el.lastVisit;
    //         enrolData.progress = el.progress !== undefined ? el.progress : 0;
    //         this.enrollList.push(enrolData);
    //       });
    //     }),
    //     first()
    //   )
    //   .toPromise();
    return collectionData(queryRef)
      .pipe(
        tap((data) => {
          this.enrollList = [];
          data.forEach((el) => {
            const enrolData: EnrollData = new EnrollData();
            enrolData.courseId = el.courseId;
            enrolData.lastVisit = el.lastVisit;
            enrolData.progress = el.progress;
            this.enrollList.push(enrolData);
          });
        }),
        first()
      )
      .toPromise();
  }

  getLecturerList() {
    const lecturerRef = collection(this.firestore, 'lecturers');
    return collectionData(lecturerRef)
      .pipe(
        tap((data) => {
          this.lecturerList = [];
          data.forEach((el) => {
            const lecturerData: LecturerData = new LecturerData();
            lecturerData.lecturerId = el.lecturerId;
            lecturerData.lecturerImageUrl =
              el.lecturerImageUrl !== undefined ? el.lecturerImageUrl : '';
            lecturerData.lecturerName =
              el.lecturerName !== undefined ? el.lecturerName : '';
            this.lecturerList.push(lecturerData);
          });
        }),
        first()
      )
      .toPromise();
  }

  formatMyCourses() {
    this.myCourses = [];
    for (const element of this.enrollList) {
      let courseData = null;
      const temp = this.courseList.filter(
        (course: any) => element.courseId === course.courseId
      );
      if (temp.length > 0) {
        courseData = temp[0];
      } else {
        courseData = this.setDefaultCourseData();
      }
      const tempL = this.lecturerList.filter(
        (lecturer: any) => courseData.lecturerId === lecturer.lecturerId
      );
      if (tempL.length > 0) {
        courseData.lecturerName = tempL[0].lecturerName;
        courseData.lecturerImageUrl = tempL[0].lecturerImageUrl;
      } else {
        courseData.lecturerName = '';
        courseData.lecturerImageUrl = '';
      }
      courseData.progress = element.progress;
      courseData.lastVisit = element.lastVisit;
      this.myCourses.push(courseData);
    }
    return this.myCourses;
  }

  formatAllCourses() {
    this.allCourses = [];
    for (const element of this.courseList) {
      let courseData = null;
      courseData = element;
      //console.log(courseData);
      const temp = this.lecturerList.filter(
        (lecturer: any) => courseData.lecturerId === lecturer.lecturerId
      );
      if (temp.length > 0) {
        courseData.lecturerName = temp[0].lecturerName;
        courseData.lecturerImageUrl = temp[0].lecturerImageUrl;
      } else {
        courseData.lecturerName = '';
        courseData.lecturerImageUrl = '';
      }
      this.allCourses.push(courseData);
    }
    return this.allCourses;
  }

  setDefaultCourseData() {
    const course = new CourseData();
    course.courseId = -1;
    course.lecturerId = -1;
    course.categoryId = -1;
    course.courseName = '';
    course.courseDescription = '';
    course.credit = -1;
    course.imageUrl = '';
    return course;
  }

  // getRecentCourses() {
  //   const recentVisit = [];
  //   const user = this.auth.currentUser;
  //   const thisRef = collection(this.firestore, `users/${user.uid}/courses`);
  //   const queryRef = query(thisRef, orderBy('lastVisit'), limit(5));
  //   collectionData(queryRef).subscribe((data) => {
  //     for (const each of data) {
  //       this.getCourse(each.courseId)
  //         .pipe(take(1))
  //         .subscribe((courseData) => {
  //           const course = courseData[0];
  //           console.log(course);
  //           this.getLecturer(course.lecturerId)
  //             .pipe(take(1))
  //             .subscribe((res: any) => {
  //               const lecturer = res[0];
  //               course.lecturerName = lecturer.lecturerName;
  //               course.lecturerImageUrl = lecturer.lecturerImageUrl;
  //             });
  //           recentVisit.push(course);
  //         });
  //     }
  //   });
  //   console.log('getRecent', recentVisit);
  //   return recentVisit;
  // }

  // getCourse(id) {
  //   const courseRef = collection(this.firestore, `courses`);
  //   const queryRef = query(courseRef, limit(1), where('courseId', '==', id));
  //   return collectionData(queryRef);
  // }

  enrolCourse(id, docId) {
    const enrolData: EnrollData = new EnrollData();
    enrolData.courseId = id;
    enrolData.lastVisit = Timestamp.now();
    enrolData.progress = 0;
    const user = this.auth.currentUser;
    const thisRef = doc(this.firestore, `users/${user.uid}/courses/${docId}`);
    return setDoc(
      thisRef,
      {
        courseId: enrolData.courseId,
        lastVisit: enrolData.lastVisit,
        progress: enrolData.progress,
      },
      { merge: true }
    );
  }

  updateRecentVisit(id, docId) {
    const enrolData: EnrollData = new EnrollData();

    enrolData.lastVisit = Timestamp.now();

    const user = this.auth.currentUser;
    const thisRef = doc(this.firestore, `users/${user.uid}/courses/${docId}`);
    return setDoc(
      thisRef,
      {
        lastVisit: enrolData.lastVisit,
      },
      { merge: true }
    );
  }

  updateCourseProgress(updatedProgress, docId) {
    const user = this.auth.currentUser;
    const thisRef = doc(this.firestore, `users/${user.uid}/courses/${docId}`);
    return setDoc(
      thisRef,
      {
        progress: updatedProgress,
      },
      { merge: true }
    );
  }

  updateLessonProgress(courseDocId, mylessonId, materialList) {
    const user = this.auth.currentUser;
    const thisRef = doc(
      this.firestore,
      `users/${user.uid}/courses/${courseDocId}/lessons/${mylessonId}`
    );
    return setDoc(
      thisRef,
      {
        lessonId: mylessonId,
        materials: materialList,
      },
      { merge: true }
    );
  }

  getLessonProgress(courseDocId) {
    const user = this.auth.currentUser;
    const thisRef = collection(
      this.firestore,
      `users/${user.uid}/courses/${courseDocId}/lessons`
    );
    return collectionData(thisRef, { idField: 'id' }).pipe(first()).toPromise();
  }

  getCourse(id) {
    const courseRef = collection(this.firestore, `courses`);
    const queryRef = query(courseRef, where('courseId', '==', id));
    return collectionData(queryRef, { idField: 'id' })
      .pipe(first())
      .toPromise();
  }

  // getLecturer(id: number) {
  //   const lecturerRef = collection(this.firestore, 'lecturers');
  //   const queryRef = query(
  //     lecturerRef,
  //     where('lecturerId', '==', id),
  //     limit(1)
  //   );
  //   return collectionData(queryRef);
  // }

  getAllAssignments() {
    const thisRef = collection(this.firestore, `assignments`);

    return collectionData(thisRef, { idField: 'id' })
      .pipe(
        tap((data) => {
          this.assignmentList = [];
          data.forEach((el) => {
            const assignment = new Assignment();
            assignment.assignmentId = el.assignmentId;
            assignment.courseId = el.courseId;
            assignment.title = el.title;
            assignment.description = el.description;
            assignment.order = el.order;
            assignment.points = el.points;
            assignment.references = el.references;
            assignment.startDate = el.startDate;
            assignment.dueDate = el.dueDate;
            assignment.status = false;
            this.assignmentList.push(assignment);
          });
        }),
        first()
      )
      .toPromise();
  }

  checkAssignmentStatus(id, assignmentId) {
    const user = this.auth.currentUser;
    const thisRef = collection(
      this.firestore,
      `users/${user.uid}/courses/${id}/assignments`
    );
    const queryRef = query(thisRef, where('assignmentId', '==', assignmentId));
    return collectionData(queryRef)
      .pipe(
        tap((data) => {
          data.forEach((el) => {
            const assignment: Assignment = new Assignment();
            assignment.status = el.status;
            assignment.courseId = el.courseId;
            assignment.assignmentId = el.assignmentId;
            assignment.submission = el.submission;
          });
        }),
        first()
      )
      .toPromise();
  }

  // async uploadAssignmentSubmission(assignmentId, file) {
  //   if (file !== null) {
  //     const user = this.auth.currentUser;
  //     const path = `assignments/${assignmentId}/${user.uid}/${file.name}`;
  //     const storageRef = ref(this.storage, path);
  //     const uploadTask = uploadBytesResumable(storageRef, file);
  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log('Upload is ' + progress + '% done');
  //         switch (snapshot.state) {
  //           case 'paused':
  //             console.log('Upload is paused');
  //             break;
  //           case 'running':
  //             console.log('Upload is running');
  //             break;
  //         }
  //       },
  //       (error) => {
  //         switch (error.code) {
  //           case 'storage/unauthorized':
  //             // User doesn't have permission to access the object
  //             break;
  //           case 'storage/canceled':
  //             // User canceled the upload
  //             break;

  //           // ...

  //           case 'storage/unknown':
  //             // Unknown error occurred, inspect error.serverResponse
  //             break;
  //         }
  //       },
  //       () => {
  //         // Upload completed successfully, now we can get the download URL
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           console.log('File available at', downloadURL);
  //         });
  //       }
  //     );
  //   }
  // }

  updateAssignmentStatus(courseId, assignmentId, assignment: Assignment) {
    const user = this.auth.currentUser;
    const assignmentRef = doc(
      this.firestore,
      `users/${user.uid}/courses/${courseId}/assignments/${assignmentId}`
    );
    return setDoc(
      assignmentRef,
      {
        status: assignment.status,
        submission: assignment.submission,
        assignmentId: assignment.assignmentId,
        courseId: assignment.courseId,
      },
      { merge: true }
    );
  }
}
