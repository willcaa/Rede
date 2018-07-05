import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CodigoDeErroPage } from '../codigo-de-erro/codigo-de-erro';
import { OrcamentosPage } from '../orcamentos/orcamentos';
import { CalculadoraPage } from '../calculadora/calculadora';
import { Http, Headers } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-ferramentas',
  templateUrl: 'ferramentas.html',
})

export class FerramentasPage {
  userId: any;
  email: any;
  nome: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
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
  getSeguroToken(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      email: this.email,
      nome: this.nome
    }
    
    let link = 'https://bluedropsproducts.com/app/usuarios/getSeguroToken';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
        if(data){}
        
      }, (err) => {
        
      });
  }

}
