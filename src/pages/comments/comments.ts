import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  texto: string;
  public comments: any;
  public post: any;
  public id_usuario: any;
  public commentId: any;
  public resposta: any;
  public totalComments:number = 0;
  public respostasView: any = {};
  public tabId = "comentarios";
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public http: Http, private storage: Storage) {
    this.tabId = "comentarios";
  }

  alterarTab(pageId){
    this.tabId = pageId;
  }

  getId(id){
    this.commentId = id;
  }
  
  carregarComentarios(){
    this.post = this.navParams.get("anuncio");

    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      anuncio: this.post
    }
    var link = 'https://refriplaybusiness.com.br/comments/puxarComentario';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.comments = data;
        this.comments.forEach(element => {
          if(element.minutos >= 60 && element.minutos< 1440){
            element.minutos = element.minutos/60;
            element.minutos = parseInt(element.minutos); 
            element.minutos = element.minutos + ' hora(s) atrás' ;
          }
          else if(element.minutos < 60){
            element.minutos = element.minutos + ' minuto(s) atrás';
          }
          else if(element.minutos >= 1440){
            element.minutos = element.minutos/60;
            element.minutos = element.minutos/24;
            element.minutos = parseInt(element.minutos); 
            element.minutos = element.minutos + ' dia(s) atrás';
          }
         
          
        });
    });
  }
  
  somarComments(){
    this.comments.forEach(element => {
      console.log(element);
      this.totalComments = this.totalComments + parseInt(element.respostas_qtd) + 1;
    });

    this.enviarSoma();
  }

  goFeed(){
    this.navCtrl.push('FeedPage');
  }

  enviarSoma(){
    console.log(this.totalComments);
    let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');
            headers.append('content-type', 'application/json');

            let body = {
              total: this.totalComments,
              anuncio: this.post
            }

            let link = 'https://refriplaybusiness.com.br/comments/somar';

            this.http.post(link, JSON.stringify(body), { headers: headers })
            .map(res => res.json())
            .subscribe(data => {
              if(data){
                console.log(data);
              }
            });
  }

  deletarComentario( comment ) {
    let confirm = this.alertCtrl.create({
      title: 'Você Realmente Deseja Deletar Este Comentario?',
      message: 'Caso você delete este comentario ele desaparecerá permanentemente!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            let index = this.comments.indexOf(comment);
              if(index > -1){
                this.comments.splice(index, 1);
              }
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');
            headers.append('content-type', 'application/json');

            let body = {
              commentId: comment.id,
            }

            let link = 'https://refriplaybusiness.com.br/comments/deletarComentario';

            this.http.post(link, JSON.stringify(body), { headers: headers })
            .map(res => res.json())
            .subscribe(data => {

            });
          }
        }
      ]
    });
    confirm.present();
  }

  enviarComentario(){

    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      anuncio: this.post,
      commUser: this.id_usuario,
      comments: this.texto
    }
    var link = 'https://refriplaybusiness.com.br/comments/salvarComentario';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data) {
          this.texto = "";
          this.carregarComentarios();
        }
    });
  }

  ionViewDidLoad() {
    this.storage.get('meuid').then((val) => {
      console.log('Id', val);
      this.id_usuario = val;
    });
    this.carregarComentarios();
    console.log('ionViewDidLoad CommentsPage');
  }

  responder(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      resposta: this.resposta,
      userId: this.id_usuario,
      commentId: this.commentId
    }
    var link = 'https://refriplaybusiness.com.br/comments/responder';
    console.log(this.resposta, this.id_usuario, this.commentId);
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data) {
          console.log(data);
          this.resposta = '';
          this.alterarTab('comentarios');
          this.carregarComentarios();
        }
    });
  }

  public getRespostas(id){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: id
    }
    var link = 'https://refriplaybusiness.com.br/comments/getRespostas';
    console.log(this.resposta, this.id_usuario, this.commentId);
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data) {
          console.log(data);
          this.respostasView = data;
          this.alterarTab('respostasView');
        }
    });
  }

}
