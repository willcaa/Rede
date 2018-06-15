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
  public clienteDados: any;
  public produtoDados: any;
  public servicoDados: any;
  public servicos: any;
  public clientes: any;
  public clienteSelecionado: boolean;
  public fabBottom: any;
  public clientesSelecionados = [];
  public idToRemove = [];
  public i = 0;
  public total = 0;
  public produtoSelecionado: boolean;
  public dados: any;
  public dadosProduto= [];
  public servicoSelecionado: boolean;
  public dadosServico=[];
  pageId: any;
  checkB: any;
  mbFab: any;
  habCheck: any;
  userName: any;
  userId: any;
  userImagem: any;
  userEmail: any;
  public clienteId: any;
  public produtoId: any;
  public servicoId: any;
  clienteNome: any;
  clienteDocumento: any;
  clienteEmail: any;
  clienteTelefone: any;
  clienteEndereco: any;
  orcamento: any;
  servico: any;
  produto: any;
  productId: any;
  productName: any;
  productVal: any;
  productQty: any;
  productUni: any;
  servDesc: any;
  servVal: any;
  servQty: any;
  cucumber: boolean;
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
    this.fabBottom = '10px';
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
    if(tabId == 'orcamentos' || tabId == 'orcamentos_p' || tabId == 'orcamentos_c'|| tabId == 'orcamentos_a'){
      this.fabBottom = '75px';
    } else {
      this.fabBottom = '10px';
    }
  }

  selectChecked(e: any, a:any) {
    console.log(e.value);
    if(e.value){
      console.log(a);
      this.idToRemove.push(a);
    }
    else{
      this.idToRemove.splice(this.idToRemove.indexOf(a),1);
      
    }
    console.log(this.idToRemove.valueOf());
    
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

  public setCliente(nome_cliente, email_cliente, doc, tel, address, tipo){
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
      }
      console.log(data);
    });
  }

  public getClientes(){
    this.idToRemove = [];
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.userId
    }
    console.log(this.userId);
    var link = 'https://bluedropsproducts.com/app/ferramentas/getClientes';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.clientes = data;
        console.log(data);
      }
    });
  }

  public deleteChecked(pageId){
    console.log(pageId);
    if(pageId == 'clientes'){
      if(this.idToRemove != null){
          console.log(this.idToRemove);
          this.deleteCliente(this.idToRemove); 
      }
      else
        console.log("Nao há clientes a serem removidos!");
    }
    else if(pageId == 'produtos'){
      if(this.idToRemove != null){
        console.log(this.idToRemove);
        this.deleteProduto(this.idToRemove); 
      }
      else
        console.log("Nao há produtos a serem removidos!");
    }
    else if(pageId == 'servicos'){
      if(this.idToRemove != null){
        console.log(this.idToRemove);
        this.deleteServico(this.idToRemove); 
      }
      else
        console.log("Nao há serviços a serem removidos!");
    }
  }

  public deleteCliente(id){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
        id: id
    }
    console.log(id);
    var link = 'https://bluedropsproducts.com/app/ferramentas/removeCliente';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.clientes = data;
        console.log(data);
      }
    });
  }

  public deleteProduto(id){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
        id: id
    }
    console.log(id);
    var link = 'https://bluedropsproducts.com/app/ferramentas/removeProduto';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.clientes = data;
        console.log(data);
      }
    });
  }

  public deleteServico(id){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
        id: id
    }
    console.log(id);
    var link = 'https://bluedropsproducts.com/app/ferramentas/removeServico';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.clientes = data;
        console.log(data);
      }
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
      unidade: unidade_produto,
      userId: this.userId
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
  
  public getProdutos(){
    this.idToRemove = [];
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.userId
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getProdutos';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.produtos = data;
        console.log(data);
      }
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
      quantidade: quantidade_serv,
      userId: this.userId
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

  public getServicos(){
    this.idToRemove = [];
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.userId
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getServicos';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.servicos = data;
        console.log(data);
      }
    });
  }

  getCliente(id, fab){
    this.clienteId = id;
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: id
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getCliente';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.clienteDados = data;
        this.alterarTab("clientes_m", fab);
        console.log(data);
      }
    });
  }
  
  getClient(id){
    
    this.clienteId = id;
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: id
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getCliente';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.dados = data;  
        console.log(data);
      }
    });
  }
  
  public updateCliente(nome_cliente, email_cliente, doc, tel, address, tipo){
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
      id: this.clienteId
    }
    var link = 'https://bluedropsproducts.com/app/ferramentas/updateCliente';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.clienteDados=data;
      }
      console.log(data);
    });
  }

  getProduto(id, fab){
    this.produtoId = id;
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: id
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getProduto';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.produtoDados = data;
        this.alterarTab("produtos_m", fab);
        console.log(data);
      }
    });
  }

  public updateProduto(nome_produto, valor_produto, quantidade_produto, unidade_produto){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      nome: nome_produto,
      valor: valor_produto,
      quantidade: quantidade_produto,
      unidade: unidade_produto,
      id: this.produtoId
    }
    var link = 'https://bluedropsproducts.com/app/ferramentas/updateProduto';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.produtoDados=data;
      }
      console.log(data);
    });
  }

  public getServico(id, fab){
    this.servicoId = id;
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: id
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getServico';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.servicoDados = data;
        this.alterarTab("servicos_m", fab);
        console.log(data);
      }
    });
  }

  
  public updateServico(descricao, valor_serv, quantidade_serv){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {

      descricao: descricao,
      valor: valor_serv,
      quantidade: quantidade_serv,
      id: this.servicoId
    }
    var link = 'https://bluedropsproducts.com/app/ferramentas/updateServico';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.servicoDados=data;
      }
      console.log(data);
    });
  }

  public usarCliente(item, fab){
    this.dados = item;
    this.clienteSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }
  usarProduto(item, fab){
    this.total = this.total + Number(item.price);
    this.dadosProduto.push(item);
    this.produtoSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }
  usarServico(item, fab){
    this.total= this.total + Number(item.price);
    this.dadosServico.push(item);
    this.servicoSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }

  setOrcamento(descricao, formaDePagamento){
    this.setBudget(descricao, formaDePagamento, this.dados.user_id, this.dados.id);
    
  }

  setBudget(descricao, pagamento, technicianId, clientId){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      description: descricao,
      payment: pagamento,
      tecid: technicianId,
      clid: clientId
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setBudget';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.orcamento = data;
        console.log(data);
      }
    });
    this.setBLabors();
    
  }

  setBLabors(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      dados: this.dadosServico,
      orcamentoid: this.orcamento.id
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setBLabors';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.servico = data;
        console.log(data);
      }
    });
    this.setBProducts();
  }

  setBProducts(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      dados: this.dadosProduto,
      orcamentoid: this.orcamento.id
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setBProducts';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.produto = data;
        console.log(data);
      }
    });
  }

}
