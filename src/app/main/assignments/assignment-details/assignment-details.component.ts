import { Location } from '@angular/common';
import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
  uploadString,
} from '@angular/fire/storage';
import { IonModal, IonProgressBar } from '@ionic/angular';
import { CourseService } from 'src/app/services/course.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.scss'],
})
export class AssignmentDetailsComponent implements OnInit, AfterContentInit {
  @ViewChild(IonModal) modal: IonModal;
  title = null;
  currentAssignment = null;
  dueDate = null;
  startDate = null;
  isOpen = false;
  selectedFile: any = null;
  uploadProgress: any = 0;
  displayLoading = false;
  constructor(
    private courseService: CourseService,
    private location: Location,
    private auth: Auth,
    private storage: Storage,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit() {
    if (history.state.details === true) {
      this.title = 'Details';
      this.currentAssignment = this.courseService.getCurrentAssignment();
      if (
        this.currentAssignment === null ||
        this.currentAssignment === undefined
      ) {
        this.navigateBack();
      }
      //format date
      const due = this.currentAssignment.dueDate.toDate();
      this.dueDate = `${due.toDateString()} ${due.toLocaleTimeString()}`;
      const start = this.currentAssignment.startDate.toDate();
      this.startDate = `${start.toDateString()} ${start.toLocaleTimeString()}`;
    } else {
      this.navigateBack();
    }
  }

  ngAfterContentInit(): void {
    if (
      this.currentAssignment === null ||
      this.currentAssignment === undefined
    ) {
      this.navigateBack();
    }
  }

  navigateBack() {
    this.location.back();
  }

  onRefClick(url) {
    window.open(url);
  }

  onAddSubmissionClick() {}

  async chooseFile(event) {
    this.selectedFile = event.target.files[0];
    const file = event.target.files[0];
    // const upload = await this.courseService
    //   .uploadAssignmentSubmission(this.currentAssignment.id, this.selectedFile)
    const upload = this.uploadAssignmentSubmission(
      this.currentAssignment.id,
      this.selectedFile
    );
  }

  async uploadAssignmentSubmission(assignmentId, file) {
    //const loading = await this.feedbackService.createLoading();
    //await loading.present();
    if (file !== null) {
      const user = this.auth.currentUser;
      const path = `assignments/${assignmentId}/${user.uid}/${file.name}`;
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.displayLoading = true;
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          this.uploadProgress = progress;
          // switch (snapshot.state) {
          //   case 'paused':
          //     console.log('Upload is paused');
          //     break;
          //   case 'running':
          //     console.log('Upload is running');
          //     break;
          // }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            //await loading.dismiss();
            this.currentAssignment.status = true;
            this.currentAssignment.submission = downloadURL;
            const result = await this.courseService.updateAssignmentStatus(
              this.currentAssignment.courseId,
              this.currentAssignment.id,
              this.currentAssignment
            );
          });
        }
      );
    }
    this.displayLoading = false;
  }
}
