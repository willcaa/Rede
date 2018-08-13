import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController  } from 'ionic-angular';

/**
 * Generated class for the PublicarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publicar',
  templateUrl: 'publicar.html',
})
export class PublicarPage {
  public locais: any;
  public type: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.locais = this.viewCtrl.data;
  }

  setType(type){
    this.type = type;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicarPage');
  }
  back() {
    this.viewCtrl.dismiss(this.type);
  }
}
