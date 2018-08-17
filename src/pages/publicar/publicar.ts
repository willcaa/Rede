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
  public locaisFull: any;
  public search: any;
  public type: any;
  public tabId: any = "locais";
  public local: any;
  public localChoose: any = "padrao";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.locais = this.viewCtrl.data.locais;
    this.locaisFull = this.viewCtrl.data.locaisFull;

  }
  searchLocal(terms){
    if(this.tabId == "locais"){
      this.tabId = "locaisFull";
    }
    if(terms == ''){
      this.tabId = "locais";
    }
    this.search = this.filterLocais(terms);
    console.log(this.search);
  }

  filterLocais(terms){
   return this.locaisFull.filter((item) => {
      console.log(item);
      return item.toLowerCase().indexOf(terms.toLowerCase()) > -1;
    })
  }

  setType(type){
    this.type = type;
    this.back();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicarPage');
  }
  back() {
    if(this.localChoose == 'local'){
      this.local = "none"
    }
    this.viewCtrl.dismiss({type: this.type, local: this.local});
  }
}
