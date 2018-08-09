import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PreperfilPage } from '../preperfil/preperfil';
import { PopoverController } from 'ionic-angular';
import { PopoverNotificacoesComponent } from '../../components/popover-notificacoes/popover-notificacoes';
import { CommentsPage } from '../comments/comments';
import { NotificacoesPage } from '../notificacoes/notificacoes';

@IonicPage()
@Component({
  selector: 'page-pesquisar',
  templateUrl: 'pesquisar.html',
})
export class PesquisarPage {
  public notificacoes_qts: any;
  public tabId: string = 'init';
  usuarios: any =[];
  userId: any;

  constructor(public viewCtrl: ViewController,public popoverCtrl: PopoverController,public navCtrl: NavController, public navParams: NavParams, public http: Http, public _sanitizer: DomSanitizer) {
    this.userId = this.navParams.get("userId");
  }

  goFeed(){
    this.navCtrl.pop();
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
  notificacoes(myEvent) {
    let popover = this.popoverCtrl.create(PopoverNotificacoesComponent, { id_usuario: this.userId }, { cssClass: "popover-notificacoes" });
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if (popoverData) {
        if (popoverData.tipo == "perfil") {
          this.goPerfil(popoverData.id);
        } else if (popoverData.tipo == "post") {
          this.comments(popoverData.id);
        }
      }
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        id_usuario: this.userId,
      }
      var link = 'https://wa-studio.com/redelive/usuarios/limparNotificacoes';

      this.http.post(link, JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.notificacoes_qts = 0;
        });
    })
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
  goPerfil(perfil_id) {
    let data = {
      tipo: "perfil",
      id: perfil_id
    }
    this.viewCtrl.dismiss(data);
  }
  comments(postId) {
    this.navCtrl.push(CommentsPage, {
      anuncio: postId
    });
    // let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Accept', 'application/json');
    // headers.append('content-type', 'application/json');
    // let body = {
    //   anuncio: postId,
    //   liker: this.userId
    // }
    // var link = 'https://wa-studio.com/redelive/likes/top';
    // this.http.post(link, JSON.stringify(body), { headers: headers })
    //   // .map(res => res.json())
    //   .subscribe(data => {
    //     console.log(data);
    //     // console.log(data.data);
    //   });
  }
  goNotif(id_perfil = this.userId) {
    this.navCtrl.push(NotificacoesPage, {userId: id_perfil});
    console.log(id_perfil);
  }
}
