import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MarcasArCondicionadoPage } from '../marcas-ar-condicionado/marcas-ar-condicionado';
import { AlertController } from 'ionic-angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { text } from '@angular/core/src/render3/instructions';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController) {
  }
  goPage(){
    this.navCtrl.push(MarcasArCondicionadoPage);
  }

  new(){
    let confirm = this.alertCtrl.create({
      title: "Novidade!",
      message: "Uma nova ferramenta Código de Erro está sendo desenvolvida. Mais novidades em breve!",
      buttons:[
        {
          text: "Ok",
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CodigoDeErroPage');
    this.new();

  }

}
