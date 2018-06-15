import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
})
export class ListaPage {
  public productId: any;
  public produto: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.productId = this.navParams.get("productId");
  }

  getLista(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {productId: this.productId}

    var link = 'https://bluedropsproducts.com/app/ferramentas/getLista';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
        this.produto = data;
        console.log(this.produto);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaPage');
    this.getLista();
    console.log(this.productId)
  }

}
