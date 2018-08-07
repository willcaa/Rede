import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController } from 'ionic-angular';
import { CodigoDeErroPage } from '../codigo-de-erro/codigo-de-erro';
import { OrcamentosPage } from '../orcamentos/orcamentos';
import { CalculadoraPage } from '../calculadora/calculadora';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http, Headers, RequestOptions } from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-ferramentas',
  templateUrl: 'ferramentas.html',
})

export class FerramentasPage {
  userId: any;
  email: any;
  nome: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser, public http: Http, public alertCtrl: AlertController) {
    this.userId = this.navParams.get("userId");
    this.email = this.navParams.get("email");
    this.nome = this.navParams.get("nome");
  }

  goErrorCode(){
    this.navCtrl.push(CodigoDeErroPage);
  }

  goOrcamentosPage(){
    this.navCtrl.push(OrcamentosPage);
  }
 
  goCalculadoraPage(){
    this.navCtrl.push(CalculadoraPage,{userId: this.userId});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FerramentasPage');

  }

  goSeguro(){
    let alert = this.alertCtrl.create({
      title: 'Por favor insira os dados:',
      inputs: [
        {
          name: 'cpf',
          placeholder: 'Cpf' 
        },
        {
          name: 'tel',
          placeholder: 'Celular'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('cancel');
          }
        },
        {
          text: 'Confirmar',
          handler: data => {
            this.loadSeguro(data.cpf, data.tel);
            console.log(data);
          }
        }

      ]
    });

    alert.present();
  }

  loadSeguro(cpf, telefonecelular){
    
    const headers = new Headers()

    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const options = new RequestOptions({ headers: headers });
    const body =  {
      cpf: cpf, 
      telefonecelular: telefonecelular};



    // let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('content-type', 'application/x-www-form-urlencoded');

    // let body = {
    //   cpf: cpf,
    //   telefonecelular: tel
    // }

    const link = 'http://refriplaybusiness.com.br:3000/previsul';
    console.log(body);
    this.http.post(link, body, options).map(res => res.json())
    .subscribe(data => {
      if(data){
        console.log(data);
        this.iab.create(data);
      }
    });
  }

  getSeguroToken(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      email: this.email,
      nome: this.nome
    }
    
    let link = 'https://refriplaybusiness.com.br/usuarios/getSeguroToken';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
        if(data){}
        
      }, (err) => {
        
      });
  }

  openBrowser(url){
    console.log(url);
    const browser = this.iab.create(url);
  }

}
