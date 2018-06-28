import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ListaPage } from '../lista/lista';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';



@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {
  public marca: any;
  public marcaId: any;
  public produtos: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private _sanitizer: DomSanitizer) {
    this.marcaId = this.navParams.get("marcaId");
  }
  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdutosPage');
    this.getProdutos();
  }
  getProdutos(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {marcaId: this.marcaId}

    var link = 'https://bluedropsproducts.com/app/ferramentas/getMarca';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
        this.marca = data;
        console.log(this.marca);
      });
  }
  goList(product_id){
    this.navCtrl.push(ListaPage, {productId: product_id});
  }

}
