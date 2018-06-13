import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
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
  public produtos: any;
  public servicos: any;
  public clientes: any;
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
  productId: any;
  productName: any;
  productVal: any;
  productQty: any;
  productUni: any;
  servDesc: any;
  servVal: any;
  servQty: any;
  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, public http: Http) {
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

  setCliente(nome_cliente, email_cliente, doc, tel, address, tipo){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      nome: nome_cliente,
      email: email_cliente,
      documento: doc,
      telefone: tel,
      endereço: address,
      tipo_documento: tipo,
      id: this.userId
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setCliente';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data){
          this.clienteNome = nome_cliente;
          this.clienteEmail = email_cliente;
          this.clienteDocumento = doc;
          this.clienteTelefone = tel;
          this.clienteEndereco = address;
          this.userId = data.id;
        }
        console.log(data);
      });
    
  }

  public getClientes(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getCliente';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        // if(data){
        //   this.clienteNome = data.nome;
        //   this.clienteEmail = data.email;
        //   this.clienteDocumento = data.documento;
        //   this.clienteTelefone = data.telefone;
        //   this.clienteEndereco = data.endereço;
        // }
        console.log(data);
      });
    
  }

  public setProduto(nome_produto, valor_produto, quantidade_produto, unidade_produto){
    console.log(valor_produto);
    console.log(quantidade_produto);
    console.log(unidade_produto);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      nome: nome_produto,
      valor: valor_produto,
      quantidade: quantidade_produto,
      unidade: unidade_produto
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setProduto';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data){
          
          this.productName = nome_produto;
          this.productQty = quantidade_produto;
          this.productVal = valor_produto;
          this.productUni = unidade_produto;
          this.productId = data.id;
        }
        console.log(data);
      });
    
  }

  public setServico(descricao, valor_serv, quantidade_serv){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      descricao: descricao,
      valor: valor_serv,
      quantidade: quantidade_serv
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setServico';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data){
          this.servDesc = descricao;
          this.servQty = quantidade_serv;
          this.servVal = valor_serv;
        }
        console.log(data);
      });
    
  }



  
}
