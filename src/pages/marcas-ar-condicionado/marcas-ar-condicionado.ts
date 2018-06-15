import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ProdutosPage } from '../produtos/produtos';

@IonicPage()
@Component({
  selector: 'page-marcas-ar-condicionado',
  templateUrl: 'marcas-ar-condicionado.html',
})

export class MarcasArCondicionadoPage {

  userId: any;
  public notificacoes_qts: any;
  public marcas: any;
  public marca: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private _sanitizer: DomSanitizer) {
    this.http = http;
  }

  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  getMarcas() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {}

    var link = 'https://bluedropsproducts.com/app/ferramentas/getMarcas';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
        this.marcas = data;
        console.log(this.marcas);
      });
  }

  goMarca(id){
    this.navCtrl.push(ProdutosPage, {marcaId: id});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarcasArCondicionadoPage');
    this.getMarcas();
  }

}
