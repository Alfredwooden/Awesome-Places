import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { ModalController, ToastController, LoadingController } from 'ionic-angular'; 

import { SetLocationPage } from "../set-location/set-location";
import { Location } from '../../models/location';

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: -31.42300527468759,
    lng: -64.17864203453064
  }

  locationIsSet = false;
  imageUrl = '';

  constructor (private modalCtrl: ModalController, private geolocation: Geolocation,
              private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              private camera: Camera) {}

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content:'Getting your location...'
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then(
        location => {
          loader.dismiss();
          this.location.lat = location.coords.latitude;
          this.location.lat = location.coords.longitude;
          this.locationIsSet = true;
        }
      )
      .catch(
        error => {
          loader.dismiss();
          const toast = this.toastCtrl.create({
            message: 'Could get location, please pick it manually!',
            duration: 2500
          });
          toast.present();
        }
      );
  }

  onTakePhoto() {
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
    })
    .then(
      imageData => {
        this.imageUrl = imageData;
      }
    )
    .catch(
      err => {
        console.log(err);
      }
    );
  }

}
