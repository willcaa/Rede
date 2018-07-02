import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
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
  totalMateriais: any = 0;
  totalServicos: any = 0;
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
  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, private fileOpener: FileOpener, private fileChooser: FileChooser, private filePath: FilePath,  private transfer: FileTransfer, public file: File) {
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

  makePdf(){

    let self = this;

    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var imageUrl = 'data:image/png;base64,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';
    var docDefinition = {
      content: [
        {
          columns: [
            {
              image: 'img'
            },
            
            [
              {text: 'RefriPlay', style: 'header'},
              {text: ['Técnico: ', this.userName], style: 'sub_header'},
              {text: ['Email: ', this.userEmail], style: 'header'}
              
            ]
          ],
          
        },
        {text: 'Orçamento\n\n\n', style:'maintitle'},
        {text: 'Materiais e Produtos:\n', style: 'title'},
        {text: ['Total: ', this.totalMateriais, ',00\n'], style: 'content'},
        {text: 'Custos Indiretos:\n', style:'title'},
        {text: ['Total: ', this.totalServicos, ',00\n'], style: 'content'},
        {text: 'Descrição serviços:\n', style: 'title'},
        {text: [ this.orcamentoView.orcamento.description, '\n'], style: 'content'},
        {text: 'Forma de pagamento:\n', style: 'title'},
        {text: [ this.orcamentoView.orcamento.payment_details, '\n\n'], style: 'content'},
       
        {text: ['Valor Total: R$', this.total, ',00\n'], style: 'title'}
      ],

      images: {
        img: imageUrl
      },

      styles: {
        header: {
          bold: true,
          fontSize: 20,
          alignment: 'right',
        },

        sub_header:{
          fontSize: 18,
          alignment:'right',
        },

        url: {
          fontSize: 16,
          alignment: 'right',
        },
        maintitle: {
          bold: true,
          alignment: 'center',
          fontSize: 22,
        },
        title:{
          bold: true,
          alignment: 'center',
          fontSize: 18,
        },
        content:{
          alignment: 'left',
          margin: [0, 15, 0 , 0],
          width: '50%',
          fontSize: 14,
        }
      },
      
      pageSize: 'A4',

      pageOrientation: 'portrait'
    };

    pdfmake.createPdf(docDefinition).getBuffer(function (buffer){
      let utf8 = new Uint8Array(buffer);
      let binaryArray = utf8.buffer;
      self.saveToDevice(binaryArray, "orcamento-refriplay.pdf");
    })
  }
  
  saveToDevice(data: any, savefile: any){
    let self = this;
    self.file.writeFile(self.file.externalRootDirectory, savefile, data, {replace: true}).then(file=>
      this.fileOpener.open(self.file.externalRootDirectory + savefile, 'application/pdf').then(file2 => {
      }).catch(err => {
        alert(JSON.stringify(err));
      })
    );
  }

  public return(res){
    return res;
  }
  alterarTab(tabId, fab){
    if(fab){
      this.closeFab(fab);
    }
    if(tabId == 'orcamentos_p' || tabId == 'orcamentos_c' || tabId == 'orcamentos_a'){
      this.getOrcamentos();
    }
    if(tabId == 'servicos'){
      this.getServicos();
    }
    if(tabId == 'produtos'){
      this.getProdutos();
    }
    if(tabId == 'clientes'){
      this.getClientes();
    }
    if(tabId == 'orcamentos' || tabId == 'orcamentos_p' || tabId == 'orcamentos_c'|| tabId == 'orcamentos_a'){
      this.fabBottom = '75px';
    } else {
      this.fabBottom = '10px';
    }
    this.lastPageId = this.pageId;
    this.pageId = tabId;
    console.log(this.lastPageId, this.pageId);
    
  }

  openFab(fab){
    if(fab){
      this.openFab(fab);
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
      
        this.clientes = data;
        this.getClientes();
        console.log(data);
      
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
      
        this.clientes = data;
        this.getProdutos();
        console.log(data);
      
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
              
              this.clientes = data;
              console.log(data);
              this.alterarTab('orcamentos_c', fab);
              
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
     
        this.clientes = data;
        this.getServicos();
        console.log(data);
      
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
              this.totalMateriais = this.totalMateriais + element.price;
              console.log(element.price, this.total);
              
            });
            data.orcamentoServicos.forEach(element => {
              this.total = this.total + (element.price * element.qty);
              this.totalServicos = this.totalServicos + element.price;
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
