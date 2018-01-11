import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { ModalController, ToastController, LoadingController } from 'ionic-angular'; 

import { SetLocationPage } from "../set-location/set-location";
import { Location } from '../../models/location';
import { PlacesService } from '../../service/places';
import { File, Entry, FileError } from '@ionic-native/file';

declare var cordova: any;

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
              private camera: Camera, private placesService: PlacesService, private file: File) {}

  onSubmit(form: NgForm) {
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: -31.42300527468759,
      lng: -64.17864203453064
    };
    this.imageUrl = '';
    this.locationIsSet = false;
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
        err => {
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
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';
        this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName) 
          .then(
            (data: Entry) => {
              this.imageUrl = data.nativeURL;
              this.camera.cleanup();
              // this.file.removeFile(path, currentName);
            }
          )
          .catch(
            (err: FileError) => {
              this.imageUrl = '';
              const toast = this.toastCtrl.create({
                message: 'Could not save the image, please try again.',
                duration: 2500,
              });
              toast.present();
              this.camera.cleanup();
            }
          ) 
        this.imageUrl = imageData;
      }
    )
    .catch(
      err => {
        const toast = this.toastCtrl.create({
          message: 'Could not take the image, please try again.',
          duration: 2500,
        });
        toast.present();
      }
    );
  }

}
