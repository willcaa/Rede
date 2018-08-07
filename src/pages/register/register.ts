import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, ToastController, NavParams, Content, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { FeedPage } from '../feed/feed';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  loginInvalido = false;
  isLoggedIn:boolean = false;
  users: any;
  destination: string;
  start: string;
  data:any = {};
  loginId: number;
  cNome:string = "";
  cEmail: string = "";
  cPw: string = "";
  cPw2: string = "";
  pageId:any;
  email:any;
  senha:any;
  eEmail:any;
  msgCadastro:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, private fb: Facebook, private storage: Storage, private alertCtrl: AlertController) {
    this.pageId="login";
    console.log(this.cNome);
    this.http = http;
    this.start = "";
    this.destination = "";
    fb.getLoginStatus()
    .then(res => {
      console.log(res.status);
      if(res.status === "connect") {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e));
  }
  alterarTab(Id){
    this.pageId = Id;
    console.log(this.pageId);
  }


  cadastrar(email, nome, pw) {
  
    this.storage.get('meuid').then((val) => {
      console.log('Id', val);
      this.loginId = val;
    });
      let headerx = new Headers();
      headerx.append('Access-Control-Allow-Origin', '*');
      headerx.append('Accept', 'application/json');
      headerx.append('content-type', 'application/json');
      var body = {
        email: email,
        nome: nome,
        pw: pw,
        imagem: 'none'
      }
      var link = 'https://refriplaybusiness.com.br/usuarios/cadastrar';
  
      this.http.post(link, body, { headers: headerx })
        .map(res => res.json())
        .subscribe(data => {
          if ( data.email && data.senha ) {
            this.cNome = '';
            this.cEmail = '';
            this.cPw = '';
            this.cPw2 = '';
            this.loginEmail(data.email, data.senha);
          } else {
            this.msgCadastro = data;
          }
        });
    
  }

  cadastrarFacebook(email, nome, imagem) {
    var senha = 'facebookGeral';
      let headerx = new Headers();
      headerx.append('Access-Control-Allow-Origin', '*');
      headerx.append('Accept', 'application/json');
      headerx.append('content-type', 'application/json');
      var body = {
        email: email,
        nome: nome,
        pw: senha,
        imagem: imagem
      }
      var link = 'https://refriplaybusiness.com.br/usuarios/cadastrarFace';
  
      this.http.post(link, body, { headers: headerx })
        .map(res => res.json())
        .subscribe(data => {
          // alert(JSON.stringify(data));
          if ( data.email ) {
            this.cNome = '';
            this.cEmail = '';
            this.cPw = '';
            this.cPw2 = '';
            this.loginEmail(data.email, senha);
          };
        });
    
  }

  public setStorage(data) {
    this.save('nome', data.nome).then(data1=>{
      this.save('email', data.email).then(data2=>{
        this.save('imagem', data.user_image).then(data3=>{
          this.save('meuid', data.id).then(data4=>{
            this.navCtrl.push('FeedPage');
          });
        });
      });
    });
  }

  private async save(key: string, data: string) {
    return this.storage.set(key, data);
  }

  goFeed(data) {
    this.navCtrl.push('FeedPage',{
      nome: data.nome,
      email: data.email,
      imagem: data.user_image,
      meuid: data.id
    });
  }

  login() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then(res => {
      if(res.status === "connected") {
        this.isLoggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
  }

  loginEmail(email, pw){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      email: email,
      pw: pw
    }

    let link = 'https://refriplaybusiness.com.br/usuarios/loginEmail';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if( data && data != null ){
          this.setStorage(data);
        }
        else{
          this.loginInvalido = true;
        }
      });
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }

  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=picture.width(9999).height(9999),id,email,name,gender",["public_profile"])
      .then(res => {
        this.users = res;
        this.cadastrarFacebook(this.users.email, this.users.name, this.users.picture.data.url);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  ionViewDidLoad() {
    
    console.log('ionViewDidLoad RegisterPage');
    // this.cadastrar();
  }

  novaSenha(email){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      email: email,
    }

    let link = 'https://refriplaybusiness.com.br/usuarios/esqueciSenha';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data != false){
          this.presentAlert();
          this.alterarTab('login');
        }
        else{
          this.presentAlertErro();
          this.alterarTab('login')
        }
      });
  }
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Senha gerada com sucesso!',
      subTitle: 'Sua senha foi gerada com sucesso e enviada para o seu email.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  presentAlertErro() {
    let alert = this.alertCtrl.create({
      title: 'Erro!',
      subTitle: 'O email inserido não está cadastrado ou não existe!',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
