import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FeedbackService } from 'src/app/services/feedback.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import {
  UserDataService,
  CountryData,
} from 'src/app/services/user-data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, AfterContentInit {
  userProfile = null;
  isLoaded = false;
  isEdit = false;
  user = null;
  back = true;
  selectedCountryData: CountryData[] = [];
  genderIcon = '../../assets/icon/gender.png';
  nationalityIcon = '../../assets/icon/countries.png';
  schoolIcon = '../../assets/icon/school.png';
  userProfileImage = null;
  profileForm: FormGroup;
  countries: any;

  constructor(
    private userDataService: UserDataService,
    private feedbackService: FeedbackService,
    private authService: UserAuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
  }

  async ngAfterContentInit() {
    await this.getUserProfileData();

    this.countries = await this.userDataService.getCountries();
  }

  async getUserProfileData() {
    this.userDataService.getProfile().subscribe((data) => {
      this.userProfile = data;
      this.isLoaded = true;
      this.userProfileImage = data.imageUrl;
    });
    console.log(this.userProfile);
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });

    if (image) {
      const loading = await this.feedbackService.createLoading();
      await loading.present();

      const result = await this.userDataService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        await this.feedbackService.showAlert(
          'Upload failed',
          'There was a problem uploading your avatar.'
        );
      }
    }
  }

  onEditClick() {
    this.isEdit = true;
    if (
      this.userProfile.nationality !== null &&
      this.userProfile.nationality !== ''
    ) {
      const selectedCountry = new CountryData();
      selectedCountry.name = this.userProfile.nationality;
      selectedCountry.flag = this.userProfile.countryflag;
      this.selectedCountryData.push(selectedCountry);
    }
  }

  changePassword() {
    this.router.navigateByUrl('/main/account/manage-password');
  }

  async submitForm() {
    const result = await this.userDataService.updateUserProfile(
      this.userProfile
    );
  }

  onCancel() {
    this.isEdit = false;
  }

  selectChanged(event) {
    this.userProfile.nationality = event[0].name.common;
    this.userProfile.countryflag = event[0].flags.png;
  }
}
