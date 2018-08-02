import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PreperfilPage } from '../preperfil/preperfil';


@IonicPage()
@Component({
  selector: 'page-pesquisar',
  templateUrl: 'pesquisar.html',
})
export class PesquisarPage {

  public tabId: string = 'init';
  usuarios: any =[];
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public _sanitizer: DomSanitizer) {
    this.userId = this.navParams.get("userId");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PesquisarPage');
  }

  alterarTab(id){
    this.tabId = id;
    console.log(this.tabId);
  }

  limpaUsuarios(){
    this.usuarios = [];
  }

  getSrc(link) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  goPagePreperfil(perfilId, image, nome,post,seguindo,seguidores){
    console.log(perfilId, image, nome);
    this.navCtrl.push(PreperfilPage, {
        perfilId: perfilId, userId: this.userId , image: image, nome: nome,post: post, seguindo: seguindo,seguidores :seguidores
    });
  }

  public prePerfilPage(id_usuario) {
    console.log(id_usuario);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: id_usuario
    }

    let link = 'https://wa-studio.com/redelive/usuarios/getUserInfoPreperfil';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      console.log("AQUI", data)
      this.goPagePreperfil(data.usuario.id, data.usuario.user_image, data.usuario.nome,data.posts,data.seguido,data.seguidor);
  
    });
  }

  pesquisar(texto){
    console.log(texto);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      nome: texto
    }

    let link = 'https://wa-studio.com/redelive/usuarios/getAllUsersByName';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        console.log(data);
        this.usuarios = data;
        

      }
    });
  }

}
