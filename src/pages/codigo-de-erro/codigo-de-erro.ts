import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MarcasArCondicionadoPage } from '../marcas-ar-condicionado/marcas-ar-condicionado';

/**
 * Generated class for the CodigoDeErroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-codigo-de-erro',
  templateUrl: 'codigo-de-erro.html',
})
export class CodigoDeErroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  }
  goPage(){
    this.navCtrl.push(MarcasArCondicionadoPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CodigoDeErroPage');
  }

}
