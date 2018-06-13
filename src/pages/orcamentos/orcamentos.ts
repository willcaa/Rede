import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OrcamentosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orcamentos',
  templateUrl: 'orcamentos.html',
})
export class OrcamentosPage {
  pageId: any;
  checkB: any;
  mbFab: any;
  habCheck: any;
  userName: any;
  userId: any;
  userImagem: any;
  userEmail: any;
  clienteNome: any;
  clienteDocumento: any;
  clienteEmail: any;
  clienteTelefone: any;
  clienteEndereco: any;
  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams) {
    this.storage.get('meuid')
    .then( res =>{
        console.log(res);
        this.userId = res;
      } 
    );
    this.storage.get('nome')
    .then( res =>{
        console.log(res);
        this.userName = res;
      } 
    );
    this.storage.get('imagem')
    .then( res =>{
        console.log(res);
        this.userImagem = res;
      } 
    );
    this.storage.get('email')
    .then( res =>{
        console.log(res);
        this.userEmail = res;
      } 
    );
  }
  public get(key: string) {
    let returnData;
    this.storage.get(key)
    .then( res =>{
      console.log(res);
      returnData = res;
    } 
    );
    return returnData;
  }

  public return(res){
    return res;
  }
  alterarTab(tabId, fab){
    this.closeFab(fab);
    this.pageId = tabId;
    console.log(tabId);
  }
  closeFab(fab){
      fab.close();
  }
  ionViewDidLoad() {
    this.mbFab = 75;
    console.log(this.userName);
  }

  checkCheck(){
    if(this.checkB == 1){
      this.checkB = 0;
    } else {
      this.checkB = 1;
    }
  }
  showCheck(){
    if(this.habCheck == 1){
      this.habCheck = 0;
    } else {
      this.habCheck = 1;
    }
  }
  
}
