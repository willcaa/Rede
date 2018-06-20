import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';
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
  lastPageId: any;
  checkB: any;
  mbFab: any;
  habCheck: any;
  userName: any;
  userId: any;
  userImagem: any;
  userEmail: any;
  orcamentoView: any;
  qtyOrcP: any;
  qtyOrcA: any;
  qtyOrcC: any;
  public clienteId: any;
  public produtoId: any;
  public servicoId: any;
  orcamentos_p: any;
  orcamentos_a: any;
  orcamentos_c: any;
  orcamentoSelecionado: any;
  budgetMsg: any;
  clienteMsg: any;
  produtoMsg: any;
  servicoMsg: any;
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
  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, public http: Http, public alertCtrl: AlertController) {
    this.storage.get('meuid')
      .then( res =>{
          console.log(res);
          this.userId = res;
          this.loadTotalOrcamentos();
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
    this.fabBottom = '75px';
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
    if(fab){
      this.closeFab(fab);
    }
    this.lastPageId = this.pageId;
    this.pageId = tabId;
    console.log(this.lastPageId, this.pageId);
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
    this.pageId = 'orcamentos';
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

  public setCliente(nome_cliente, email_cliente, doc, tel, address, tipo, fab){
    if(nome_cliente && email_cliente && doc && tel && address && tipo){

    
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
          if(this.lastPageId == 'orcamentos_n'){
            this.alterarTab('orcamentos_n', fab);
          } else {
            this.alterarTab('clientes', fab);
          }
        }
        console.log(data);
      });
    } else {
      this.clienteMsg = "Preencha todos os dados!";
      console.log(this.clienteMsg);
    }
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

  public deleteChecked(pageId, fab){
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
    else if(pageId=='orcamentos_c'){
      if(this.idToRemove != null){
        console.log(this.idToRemove)
        this.deleteOrcamentoCancelado(this.idToRemove, fab);
      }
      else
        console.log("Nao há orçamentos a serem removidos");
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

  public deleteOrcamentoCancelado(id, fab){
    
    let confirm = this.alertCtrl.create({
      title: 'Você realmente deseja deletar este orçamento?',
      message: 'Caso você delete este orçamento ele desaparecerá permanentemente!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');
            headers.append('content-type', 'application/json');

            let body = {
              id: id
            }
            console.log(id);
            var link = 'https://bluedropsproducts.com/app/ferramentas/removeOrcamentoCancelado';
          
      
            this.http.post(link, JSON.stringify(body), { headers: headers })
            .map(res => res.json())
            .subscribe(data => {
              if(data){
                this.clientes = data;
                console.log(data);
                this.alterarTab('orcamentos_c', fab);
              }
            });
          }
        }
      ]
    });
    confirm.present();
    
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

  public setProduto(nome_produto, valor_produto, quantidade_produto, unidade_produto, fab){
    if(nome_produto && valor_produto && quantidade_produto && unidade_produto){
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
          if(this.lastPageId == 'orcamentos_n'){
            this.alterarTab('orcamentos_n', fab);
          } else {
            this.alterarTab('produtos', fab);
          }
        }
        console.log(data);
      });
    } else {
      this.produtoMsg = "Preencha todos os dados!";
      console.log(this.produtoMsg);
    }  
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

  public setServico(descricao, valor_serv, quantidade_serv, fab){
    if(descricao && valor_serv && quantidade_serv){
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
          if(this.lastPageId == 'orcamentos_n'){
            this.alterarTab('orcamentos_n', fab);
          } else {
            this.alterarTab('servicos', fab);
          }
        }
        console.log(data);
      });
    } else {
      this.servicoMsg = "Preencha todos os dados!";
      console.log(this.servicoMsg);
    }
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
    console.log(id);
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
        this.clienteDados = data[0];
        this.alterarTab("clientes_m", fab);
        console.log(this.clienteDados);
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
        this.produtoDados = data[0];
        this.alterarTab("produtos_m", fab);
        console.log(this.produtoDados);
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
        this.servicoDados = data[0];
        this.alterarTab("servicos_m", fab);
        console.log(this.servicoDados);
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
    this.dadosProduto.push(item);
    this.produtoSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }
  usarServico(item, fab){
    this.dadosServico.push(item);
    this.servicoSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }
  clearTotal(){
    this.total = 0;
  }
  addVal(qty, price){
    this.total = this.total + (qty * price);
    console.log(this.total);
  }
  remVal(qty, price){
    this.total = this.total - (qty * price);
    console.log(this.total);
  }
  public getOrcamentos(){
    this.idToRemove = [];
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.userId,
      pagina: this.pageId
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getOrcamentos';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        if(this.pageId == 'orcamentos_p'){
            this.orcamentos_p = data;
            console.log(this.orcamentos_p);
          }
          if(this.pageId == 'orcamentos_a'){
            this.orcamentos_a = data;
            console.log(this.orcamentos_a);
          }
          if(this.pageId == 'orcamentos_c'){
            this.orcamentos_c = data;
            console.log(this.orcamentos_c);
          }
        
      }
    });
  }
  
  public loadTotalOrcamentos(){
    console.log(this.userId);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.userId,
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/loadTotalOrcamentos';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
       
            this.qtyOrcP = data.pendentes;
            this.qtyOrcA = data.aprovados;
            this.qtyOrcC = data.cancelados;
            console.log(data);
          
        
      }
    });
  }
  getOrcamento(id, fab){
    this.idToRemove = [];
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: id
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/getOrcamento';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      this.total = 0;
      if(data){
            data.orcamentoProdutos.forEach(element => {
              this.total = this.total + (element.price * element.qty);
              console.log(element.price, this.total);
            });
            data.orcamentoServicos.forEach(element => {
              this.total = this.total + (element.price * element.qty);
              console.log(element.price, this.total);
            });
            this.orcamentoView = data;
            this.alterarTab('orcamento_v', fab);
            console.log(this.orcamentoView);
            this.orcamentoSelecionado = id;
        
      }
    });
  }

  excluiItemProduto(id, qty, price){
    document.getElementById(id).remove();
    this.dadosProduto =  this.dadosProduto.filter(function(el) { 
      return el.id !== id; 
        });
     this.remVal(qty, price);
        console.log( this.dadosProduto, id);
  }
  excluiItemServico(id, qty, price){
    document.getElementById("s_" + id).remove();
    this.dadosServico =  this.dadosServico.filter(function(el) { 
      return el.id !== id; 
        });
     this.remVal(qty, price);
        console.log( this.dadosServico, id);
  }

  aprovaOrcamento(fab){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.orcamentoSelecionado
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/aprovaOrcamento';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      this.total = 0;
      if(data){
        console.log(data);
        this.orcamentoSelecionado = "";
        this.alterarTab('orcamentos_a', fab);
      }
    });
  }
 
  cancelaOrcamento(fab){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.orcamentoSelecionado
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/cancelaOrcamento';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      this.total = 0;
      if(data){
        console.log(data);
        this.orcamentoSelecionado = "";
        this.alterarTab('orcamentos', fab);
      }
    });
  }

  setOrcamento(descricao, formaDePagamento, fab){
    if(descricao && formaDePagamento && this.dados.technician_id && this.dados.id){
      this.setBudget(descricao, formaDePagamento, this.dados.technician_id, this.dados.id, fab);
      this.budgetMsg = "";
    } else {
      this.budgetMsg = "Preencha todos os dados!";
      console.log(descricao, formaDePagamento, this.dados.technician_id, this.dados.id, this.dados);
    }
    
  }

  setBudget(descricao, pagamento, technicianId, clientId, fab){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      description: descricao,
      payment: pagamento,
      tecid: technicianId,
      clid: clientId,
      products: this.dadosProduto,
      services: this.dadosServico
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setBudget';
    

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.orcamento = data;
        console.log(data);
        this.alterarTab('orcamentos', fab);
      }
    });

    
  }


}
