import { Component } from '@angular/core';
import {NavParams } from 'ionic-angular';
import { Place } from '../../models/place';
import { ViewController } from 'ionic-angular';
import { PlacesService } from '../../service/places';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;
  index: number;

  constructor(public navParams: NavParams, private viewCtrl: ViewController, private placesService: PlacesService) {
    this.place = this.navParams.get ('place');
  }


  onLeave() {
    this.viewCtrl.dismiss();
  }

  onDelete() {
    this.placesService.deletePlace(this.index);
    this.onLeave();
  }
}
