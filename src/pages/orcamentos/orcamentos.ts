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
import { text } from '@angular/core/src/render3/instructions';
import { Base64 } from '@ionic-native/base64';

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
  public dadosProduto = [];
  public servicoSelecionado: boolean;
  public dadosServico = [];
  pageId: any;
  lastPageId: any;
  checkB: any;
  mbFab: any;
  habCheck: any;
  userName: any;
  userId: any;
  userImagem: any;
  userEmail: any;
  usuarioProfissional: any;
  usuarioPessoal: any;
  orcamentoView: any;
  qtyOrcP: any;
  qtyOrcA: any;
  qtyOrcC: any;
  public clienteId: any;
  public nome_cliente: any;
  public email_cliente: any;
  public doc: any;
  public tel: any;
  public address: any;
  public tipoPessoa: any;
  public produtoId: any;
  public servicoId: any;
  orcamentos_p: any;
  nome_produto: any;
  quantidade_produto: any;
  valor_produto: any;
  unidade_produto: any;
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
  descricao: any;
  quantidade_serv: any;
  valor_serv: any;
  cucumber: boolean;
  orcamentosProdutos0: any = [];
  orcamentosProdutos1: any = [];
  orcamentosProdutos2: any = [];
  orcamentosProdutos3: any = [];
  orcamentosProdutos4: any = [];
  orcamentosProdutos5: any = [];
  orcamentosProdutos6: any = [];
  orcamentosProdutos7: any = [];
  orcamentosProdutos8: any = [];
  orcamentosProdutos9: any = [];

  orcamentosServicos0: any = [];
  orcamentosServicos1: any = [];
  orcamentosServicos2: any = [];
  orcamentosServicos3: any = [];
  orcamentosServicos4: any = [];
  orcamentosServicos5: any = [];
  orcamentosServicos6: any = [];
  orcamentosServicos7: any = [];
  orcamentosServicos8: any = [];
  orcamentosServicos9: any = [];
  orcamentosServicos10: any = [];
  usuarioEndereco: any = [];

  clienteFullName: any;
  clienteEmailOrcamento: any;
  clientePhone: any;
  clienteAddress: any;
  logo: any;
  logo64: any;
  constructor(public navCtrl: NavController, private base64: Base64, private storage: Storage, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, private fileOpener: FileOpener, private fileChooser: FileChooser, private filePath: FilePath, private transfer: FileTransfer, public file: File) {
    this.storage.get('meuid')
      .then(res => {
        console.log(res);
        this.userId = res;
        this.loadTotalOrcamentos();
      }
      );
    this.storage.get('nome')
      .then(res => {
        console.log(res);
        this.userName = res;
      }
      );
    this.storage.get('imagem')
      .then(res => {
        console.log(res);
        this.userImagem = res;
      }
      );
    this.storage.get('logo')
    .then( res =>{
        console.log(res);
        this.logo = res;
      } 
    );
    this.storage.get('logo64')
    .then( res =>{
        console.log(res);
        if(res){
          this.logo64 = res;
        } else {
          this.logo64 = 'data:image/jpeg;base64,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'
        }
      } 
    );
    this.storage.get('email')
      .then(res => {
        console.log(res);
        this.userEmail = res;
      }
      );

    this.fabBottom = '75px';
  }

  public get(key: string) {
    let returnData;
    this.storage.get(key)
      .then(res => {
        console.log(res);
        returnData = res;
      }
      );
    return returnData;
  }
  getAll() {
    this.getUsuarioPessoal();
  }

  makePdf() {
    console.log(this.orcamentoView);
    console.log(this.usuarioPessoal);
    console.log(this.usuarioProfissional);
    let self = this;

    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    var img2Url = 'data:image/jpeg;base64,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'
    var imageUrl = 'data:image/png;base64,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';
    var docDefinition = {
      content: [
        {
          columns: [
            {
              image: 'logo',
              width: '100',
              height: '100',
            },
            [
              { text: [this.userName, '\n'], style: 'header_title' },
              // { text: ['Email: ', this.userEmail], style: 'header' },
              // { text: ['Endereço: ', this.usuarioPessoal.endereco, '\n'], style: 'header' }
            ]
          ],

        },
        { text: '\n' },
        { text: '_______________________________________________________________________________________________\n', style: 'bar' },

        { text: ['Cliente: ', this.clienteFullName], style: 'content_title' },
        { text: ['Telefone: ', this.clientePhone], style: 'content' },
        { text: ['Email: ', this.clienteEmailOrcamento], style: 'content' },
        { text: ['Endereço: ', this.clienteAddress, '\n'], style: 'content' },
        [

          { text: ['NUMERO DA ORDEM DE SERVIÇO #', this.orcamentoView.orcamento.id, '                                                                                                        \n'], style: 'nmr_title' },
          { text: 'Data de emissão:                                                                                                                                               \n', style: 'nmr' }
        ],

        { text: 'Materiais e Produtos\n', style: 'title' },

        {
          style: 'table1',
          table: {
            widths: [350, 100, 200],
            body: [

              ['Descrição', 'Qtd', 'Valor'],
              [this.orcamentosProdutos0.name, this.orcamentosProdutos0.qty, this.orcamentosProdutos0.price],
              [this.orcamentosProdutos1.name, this.orcamentosProdutos1.qty, this.orcamentosProdutos1.price],
              [this.orcamentosProdutos2.name, this.orcamentosProdutos2.qty, this.orcamentosProdutos2.price],
              [this.orcamentosProdutos3.name, this.orcamentosProdutos3.qty, this.orcamentosProdutos3.price],
              [this.orcamentosProdutos4.name, this.orcamentosProdutos4.qty, this.orcamentosProdutos4.price],
              // [this.orcamentosProdutos5.name, this.orcamentosProdutos5.qty, this.orcamentosProdutos5.price],
              // [this.orcamentosProdutos6.name, this.orcamentosProdutos6.qty, this.orcamentosProdutos6.price],
              // [this.orcamentosProdutos7.name, this.orcamentosProdutos7.qty, this.orcamentosProdutos7.price],
              // [this.orcamentosProdutos8.name, this.orcamentosProdutos8.qty, this.orcamentosProdutos8.price],
              // [this.orcamentosProdutos9.name, this.orcamentosProdutos9.qty, this.orcamentosProdutos9.price],

            ]
          },
          layout: 'noBorders'
        },

        { text: '---------------------------------------------------------------------------------------------------------------------------------------------------\n', style: 'bar' },
        { text: 'Subtotal dos produtos', style: 'subtotal' },
        { text: ['R$', this.totalMateriais, ',00\n'], style: 'numbr' },
        { text: '_______________________________________________________________________________________________\n', style: 'bar' },

        { text: 'Mão de e Serviços\n', style: 'title', pageBreak: 'before' },

        {
          style: 'table1',
          table: {
            widths: [350, 100, 200],
            body: [

              ['Descrição', 'Qtd', 'Valor'],
              [this.orcamentosServicos0.name, this.orcamentosServicos0.qty, this.orcamentosServicos0.price],
              [this.orcamentosServicos1.name, this.orcamentosServicos1.qty, this.orcamentosServicos1.price],
              [this.orcamentosServicos2.name, this.orcamentosServicos2.qty, this.orcamentosServicos2.price],
              [this.orcamentosServicos3.name, this.orcamentosServicos3.qty, this.orcamentosServicos3.price],
              [this.orcamentosServicos4.name, this.orcamentosServicos4.qty, this.orcamentosServicos4.price],
              // [this.orcamentosServicos5.name, this.orcamentosServicos5.qty, this.orcamentosServicos5.price],
              // [this.orcamentosServicos6.name, this.orcamentosServicos6.qty, this.orcamentosServicos6.price],
              // [this.orcamentosServicos7.name, this.orcamentosServicos7.qty, this.orcamentosServicos7.price],
              // [this.orcamentosServicos8.name, this.orcamentosServicos8.qty, this.orcamentosServicos8.price],
              // [this.orcamentosServicos9.name, this.orcamentosServicos9.qty, this.orcamentosServicos9.price],

            ]
          },
          layout: 'noBorders'

        },

        { text: '---------------------------------------------------------------------------------------------------------------------------------------------------\n', style: 'bar' },
        { text: 'Subtotal da Mão de Obra', style: 'subtotal' },
        { text: ['R$', this.totalServicos, ',00\n'], style: 'numbr' },
        { text: '_______________________________________________________________________________________________\n', style: 'bar' },
        { text: ['VALOR TOTAL                                                                                                                       R$', this.total, ',00\n'], style: 'nmr_title' },
        { text: 'DESCRIÇÃO DO SERVIÇO', style: 'descricao' },
        { text: '_______________________________________________________________________________________________\n', style: 'bar' },
        { text: [this.orcamentoView.orcamento.description, '\n\n'], style: 'desc' },
        { text: 'Formas de pagamento\n\n\n', style: 'pagmnt' },
        { text: this.orcamentoView.orcamento.payment_details, style: 'pagmento' },
        {
          columns: [
            [
              { text: 'Orçamento gerado por\n', style: 'a' },        
              {
                image: 'img1',
                width: '100',
                alignment: 'center'
              }
            ],
            [
              { text: 'Patrocinado por\n', style: 'a' },
              {
                image: 'img2',
                width: '100',
                alignment: 'center'
              }   
            ]
          ]

        }

        
        
      ],

      images: {
        logo: this.logo64,
        img1: imageUrl,
        img2: img2Url
      },

      styles: {
        header_title: {
          margin: [0, 0, 15, 0],
          bold: true,
          fontSize: 12,
          alignment: 'right'
        },
        header: {
          margin: [0, 0, 15, 0],
          bold: false,
          fontSize: 10,
          alignment: 'right'
        },
        content_title: {
          bold: true,
          alignment: 'left',
          margin: [0, 15, 0, 0],
          fontSize: 12
        },
        content: {
          margin: [0, 0, 0, 0],
          bold: false,
          alignment: 'left',
          fontSize: 10
        },
        bar: {
          color: 'lightgrey',
        },
        nmr_title: {
          bold: true,
          fontSize: '12',
          background: 'lightgrey',
          margin: [0, 17, 0, 0]
        },
        nmr: {
          background: 'lightgrey'
        },
        title: {
          bold: true,
          fontSize: 13,
          margin: [0, 15, 0, 0]
        },

        table1: {

        },

        subtotal: {
          italic: true,
          fontSize: 10,
        },
        numbr: {
          alignment: 'right',
          bold: true,
          fontSize: 11,
        },
        descricao: {
          bold: true,
          fontSize: 20,
          margin: [0, 15, 0, 0]
        },
        desc: {
          italic: true,
          fontSize: 10,
        },

        pagmnt: {
          alignment: 'center',
          bold: true,
          fontSize: 11
        },
        pagmento: {
          alignment: 'center',
          fontSize: 10,
        },

        a: {
          fontSize: 10,
          color: 'lightgrey',
          margin: [0, 20, 0, 0],
          alignment: 'center'
        },

        b: {
          fontSize: 10,
          color: 'lightgrey',
          margin: [0, 0, 20, 0],
          alignment: 'center'
        }



      },

      pageSize: 'A4',

      pageOrientation: 'portrait'
    };
    pdfmake.createPdf(docDefinition).open();

    pdfmake.createPdf(docDefinition).getBuffer(function (buffer) {
      let utf8 = new Uint8Array(buffer);
      let binaryArray = utf8.buffer;
      self.saveToDevice(binaryArray, "orcamento-refriplay.pdf");
    });
  }

  
  saveToDevice(data: any, savefile: any) {
    let self = this;
    self.file.writeFile(self.file.externalRootDirectory, savefile, data, { replace: true }).then(file =>
      this.fileOpener.open(self.file.externalRootDirectory + savefile, 'application/pdf').then(file2 => {
      }).catch(err => {
        alert(JSON.stringify(err));
      })
    );
  }

  public return(res) {
    return res;
  }
  
  alterarTab(tabId, fab) {
    if (fab) {
      this.closeFab(fab);
    }
    if (tabId == 'orcamentos_p' || tabId == 'orcamentos_c' || tabId == 'orcamentos_a') {
      this.getOrcamentos();
    }
    if (tabId == 'servicos') {
      this.getServicos();
    }
    if (tabId == 'produtos') {
      this.getProdutos();
    }
    if (tabId == 'clientes') {
      this.getClientes();
    }
    if (tabId == 'orcamentos' || tabId == 'orcamentos_p' || tabId == 'orcamentos_c' || tabId == 'orcamentos_a') {
      this.fabBottom = '75px';
    } else {
      this.fabBottom = '10px';
    }
    this.lastPageId = this.pageId;
    this.pageId = tabId;
    console.log(this.lastPageId, this.pageId);
    this.habCheck = 0;
  }

  openFab(fab) {
    if (fab) {
      this.openFab(fab);
    }
  }

  selectChecked(e: any, a: any) {
    console.log(e.value);
    if (e.value) {
      console.log(a);
      this.idToRemove.push(a);
    }
    else {
      this.idToRemove.splice(this.idToRemove.indexOf(a), 1);

    }
    console.log(this.idToRemove.valueOf());

  }
  closeFab(fab) {
    fab.close();
  }
  ionViewDidLoad() {
    this.pageId = 'orcamentos';
    this.mbFab = 75;
    console.log(this.userName);
  }

  checkCheck() {
    if (this.checkB == 1) {
      this.checkB = 0;
    } else {
      this.checkB = 1;
    }
  }
  showCheck() {
    if (this.habCheck == 1) {
      
      this.habCheck = 0;
    } else {
      this.habCheck = 1;
    }
  }
  showCheck1(fab) {
    if (this.habCheck == 1) {
      this.habCheck = 0;
    } else {
      this.habCheck = 1;
    }
  }

  public setCliente(nome_cliente, email_cliente, doc, tel, address, tipo, fab) {
    if (nome_cliente && email_cliente && doc && tel && address && tipo) {


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
          if (data) {
            this.clienteNome = nome_cliente;
            this.clienteEmail = email_cliente;
            this.clienteDocumento = doc;
            this.clienteTelefone = tel;
            this.clienteEndereco = address;
            this.nome_cliente = '';
            this.email_cliente = '';
            this.doc = '';
            this.tel = '';
            this.address = '';
            this.tipoPessoa = '';
            if (this.lastPageId == 'orcamentos_n') {
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

  public getClientes() {
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
        if (data) {
          this.clientes = data;
          console.log(data);
        }
      });
  }

  public deleteChecked(pageId, fab) {
    console.log(pageId);
    if (pageId == 'clientes') {
      if (this.idToRemove != null) {
        console.log(this.idToRemove);
        this.deleteCliente(this.idToRemove);
      }
      else
        console.log("Nao há clientes a serem removidos!");
    }
    else if (pageId == 'produtos') {
      if (this.idToRemove != null) {
        console.log(this.idToRemove);
        this.deleteProduto(this.idToRemove);
      }
      else
        console.log("Nao há produtos a serem removidos!");
    }
    else if (pageId == 'servicos') {
      if (this.idToRemove != null) {
        console.log(this.idToRemove);
        this.deleteServico(this.idToRemove);
      }
      else
        console.log("Nao há serviços a serem removidos!");
    }
    else if (pageId == 'orcamentos_c' || pageId == 'orcamentos_p' || pageId == 'orcamentos_a' ) {
      if (this.idToRemove != null) {
        console.log(this.idToRemove)
        this.deleteOrcamentoCancelado(this.idToRemove, fab);
      }
      else
        console.log("Nao há orçamentos a serem removidos");
    }
    
  }

  public deleteCliente(id) {
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

  public deleteProduto(id) {
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

  public deleteOrcamentoCancelado(id, fab) {

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

  public deleteServico(id) {
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

  public setProduto(nome_produto, valor_produto, quantidade_produto, unidade_produto, fab) {
    if (nome_produto && valor_produto && quantidade_produto && unidade_produto) {
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
          if (data) {

            this.productName = nome_produto;
            this.productQty = quantidade_produto;
            this.productVal = valor_produto;
            this.productUni = unidade_produto;
            this.productId = data.id;
            this.nome_produto = '';
            this.quantidade_produto = '';
            this.valor_produto = '';
            this.unidade_produto = '';
            if (this.lastPageId == 'orcamentos_n') {
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

  public getProdutos() {
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
        if (data) {
          this.produtos = data;
          console.log(data);
        }
      });
  }

  public setServico(descricao, valor_serv, quantidade_serv, fab) {
    if (descricao && valor_serv && quantidade_serv) {
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
          if (data) {
            this.servDesc = descricao;
            this.servQty = quantidade_serv;
            this.servVal = valor_serv;
            this.descricao = '';
            this.quantidade_serv = '';
            this.valor_serv = '';
            if (this.lastPageId == 'orcamentos_n') {
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

  public getServicos() {
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
        if (data) {
          this.servicos = data;
          console.log(data);
        }
      });
  }

  getCliente(id, fab) {
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
        if (data) {
          this.clienteDados = data[0];
          this.alterarTab("clientes_m", fab);
          console.log(this.clienteDados);
        }
      });
  }

  getClient(id) {

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
        if (data) {
          this.dados = data;
          console.log(data);
        }
      });
  }

  public updateCliente(nome_cliente, email_cliente, doc, tel, address, tipo) {
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
        if (data) {
          this.clienteDados = data;
        }
        console.log(data);
      });
  }

  getProduto(id, fab) {
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
        if (data) {
          this.produtoDados = data[0];
          this.alterarTab("produtos_m", fab);
          console.log(this.produtoDados);
        }
      });
  }

  public updateProduto(nome_produto, valor_produto, quantidade_produto, unidade_produto) {
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
        if (data) {
          this.produtoDados = data;
        }
        console.log(data);
      });
  }

  public getServico(id, fab) {
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
        if (data) {
          this.servicoDados = data[0];
          this.alterarTab("servicos_m", fab);
          console.log(this.servicoDados);
        }
      });
  }


  public updateServico(descricao, valor_serv, quantidade_serv) {
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
        if (data) {
          this.servicoDados = data;
        }
        console.log(data);
      });
  }

  public usarCliente(item, fab) {
    this.dados = item;
    this.clienteSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }
  usarProduto(item, fab) {
    this.dadosProduto.push(item);
    this.produtoSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }
  usarServico(item, fab) {
    this.dadosServico.push(item);
    this.servicoSelecionado = true;
    this.alterarTab('orcamentos_n', fab);
  }
  clearTotal() {
    this.total = 0;
  }
  addVal(qty, price) {
    this.total = this.total + (qty * price);
    console.log(this.total);
  }
  remVal(qty, price) {
    this.total = this.total - (qty * price);
    console.log(this.total);
  }
  public getOrcamentos() {
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
        if (data) {
          if (this.pageId == 'orcamentos_p') {
            this.orcamentos_p = data;
            console.log(this.orcamentos_p);
          }
          if (this.pageId == 'orcamentos_a') {
            this.orcamentos_a = data;
            console.log(this.orcamentos_a);
          }
          if (this.pageId == 'orcamentos_c') {
            this.orcamentos_c = data;
            console.log(this.orcamentos_c);
          }

        }
      });
  }

  public loadTotalOrcamentos() {
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
        if (data) {

          this.qtyOrcP = data.pendentes;
          this.qtyOrcA = data.aprovados;
          this.qtyOrcC = data.cancelados;
          console.log(data);


        }
      });
  }
  getOrcamento(id, fab) {
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
        if (data) {
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
          this.getAll();

          console.log(this.orcamentoView);
          this.orcamentoSelecionado = id;

        }
      });
  }

  excluiItemProduto(id, qty, price) {
    document.getElementById(id).remove();
    this.dadosProduto = this.dadosProduto.filter(function (el) {
      return el.id !== id;
    });
    this.remVal(qty, price);
    console.log(this.dadosProduto, id);
  }
  excluiItemServico(id, qty, price) {
    document.getElementById("s_" + id).remove();
    this.dadosServico = this.dadosServico.filter(function (el) {
      return el.id !== id;
    });
    this.remVal(qty, price);
    console.log(this.dadosServico, id);
  }

  aprovaOrcamento(fab) {
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
        if (data) {
          console.log(data);
          this.orcamentoSelecionado = "";
          this.alterarTab('orcamentos_a', fab);
        }
      });
  }

  cancelaOrcamento(fab) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id: this.idToRemove
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/cancelaOrcamento';


    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.total = 0;
        if (data) {
          console.log(data);
          this.orcamentoSelecionado = "";

          this.alterarTab('orcamentos', fab);
        }
      });
  }

  setOrcamento(descricao, formaDePagamento, fab) {
    if (descricao && formaDePagamento && this.dados.technician_id && this.dados.id) {
      this.setBudget(descricao, formaDePagamento, this.dados.technician_id, this.dados.id, fab);
      this.budgetMsg = "";
    } else {
      this.budgetMsg = "Preencha todos os dados!";
      console.log(descricao, formaDePagamento, this.dados.technician_id, this.dados.id, this.dados);
    }

  }

  setBudget(descricao, pagamento, technicianId, clientId, fab) {
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
        if (data) {
          this.orcamento = data;
          console.log(data);
          this.alterarTab('orcamentos', fab);
        }
      });


  }

  public getUsuarioProfissional() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id: this.userId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/getUsuarioProfissional';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data) {

          console.log(data);
          this.usuarioProfissional = data[0];
          if (this.orcamentoView.orcamentoProdutos[0]) {
            this.orcamentosProdutos0 = this.orcamentoView.orcamentoProdutos[0];
            this.orcamentosProdutos0.price = this.orcamentosProdutos0.price + ',00';
          }
          else {
            this.orcamentosProdutos0['name'];
            this.orcamentosProdutos0['price'] = ' ';
            this.orcamentosProdutos0['qty'] = ' ';
          }
          if (this.orcamentoView.orcamentoProdutos[1]) {
            this.orcamentosProdutos1 = this.orcamentoView.orcamentoProdutos[1];
            this.orcamentosProdutos1.price = this.orcamentosProdutos1.price + ',00';
          }
          else {
            this.orcamentosProdutos1.name = ' ';
            this.orcamentosProdutos1.price = ' ';
            this.orcamentosProdutos1.qty = ' ';
            console.log('1');
          }
          if (this.orcamentoView.orcamentoProdutos[2]) {
            this.orcamentosProdutos2 = this.orcamentoView.orcamentoProdutos[2];
            this.orcamentosProdutos2.price = this.orcamentosProdutos2.price + ',00';
          }
          else {
            this.orcamentosProdutos2.name = ' ';
            this.orcamentosProdutos2.price = ' ';
            this.orcamentosProdutos2.qty = ' ';
            console.log('2');
          }
          if (this.orcamentoView.orcamentoProdutos[3]) {
            this.orcamentosProdutos3 = this.orcamentoView.orcamentoProdutos[3];
            this.orcamentosProdutos3.price = this.orcamentosProdutos3.price + ',00';
          }
          else {
            this.orcamentosProdutos3.name = ' ';
            this.orcamentosProdutos3.price = ' ';
            this.orcamentosProdutos3.qty = ' ';
            console.log('3');
          }
          if (this.orcamentoView.orcamentoProdutos[4]) {
            this.orcamentosProdutos4 = this.orcamentoView.orcamentoProdutos[4];
            this.orcamentosProdutos4.price = this.orcamentosProdutos4.price + ',00';
          }
          else {
            this.orcamentosProdutos4.name = ' ';
            this.orcamentosProdutos4.price = ' ';
            this.orcamentosProdutos4.qty = ' ';
            console.log('4');
          }
          if (this.orcamentoView.orcamentoProdutos[5]) {
            this.orcamentosProdutos5 = this.orcamentoView.orcamentoProdutos[5];
            this.orcamentosProdutos5.price = this.orcamentosProdutos5.price + ',00';
          }
          else {
            this.orcamentosProdutos5.name = ' ';
            this.orcamentosProdutos5.price = ' ';
            this.orcamentosProdutos5.qty = ' ';
            console.log('5');
          }
          if (this.orcamentoView.orcamentoProdutos[6]) {
            this.orcamentosProdutos6 = this.orcamentoView.orcamentoProdutos[6];
            this.orcamentosProdutos6.price = this.orcamentosProdutos6.price + ',00';
          }
          else {
            this.orcamentosProdutos6.name = ' ';
            this.orcamentosProdutos6.price = ' ';
            this.orcamentosProdutos6.qty = ' ';
            console.log('6');
          }
          if (this.orcamentoView.orcamentoProdutos[7]) {
            this.orcamentosProdutos7 = this.orcamentoView.orcamentoProdutos[7];
            this.orcamentosProdutos7.price = this.orcamentosProdutos7.price + ',00';
          }
          else {
            this.orcamentosProdutos7.name = ' ';
            this.orcamentosProdutos7.price = ' ';
            this.orcamentosProdutos7.qty = ' ';
            console.log('7');
          }
          if (this.orcamentoView.orcamentoProdutos[8]) {
            this.orcamentosProdutos8 = this.orcamentoView.orcamentoProdutos[8];
            this.orcamentosProdutos8.price = this.orcamentosProdutos8.price + ',00';
          }
          else {
            this.orcamentosProdutos8.name = ' ';
            this.orcamentosProdutos8.price = ' ';
            this.orcamentosProdutos8.qty = ' ';
            console.log('8');
          }
          if (this.orcamentoView.orcamentoProdutos[9]) {
            this.orcamentosProdutos9 = this.orcamentoView.orcamentoProdutos[9];
            this.orcamentosProdutos9.price = this.orcamentosProdutos9.price + ',00';
          }
          else {
            this.orcamentosProdutos9.name = ' ';
            this.orcamentosProdutos9.price = ' ';
            this.orcamentosProdutos9.qty = ' ';
            console.log('9');
          }
          //---------------------------------------------------------------------------------------------------------------
      
      
          if (this.orcamentoView.orcamentoServicos[0]) {
            this.orcamentosServicos0 = this.orcamentoView.orcamentoServicos[0];
            this.orcamentosServicos0.price = this.orcamentosServicos0.price + ',00';
          }
          else {
            this.orcamentosServicos0.name = ' ';
            this.orcamentosServicos0.price = ' ';
            this.orcamentosServicos0.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[1]) {
            this.orcamentosServicos1 = this.orcamentoView.orcamentoServicos[1];
            this.orcamentosServicos1.price = this.orcamentosServicos1.price + ',00';
          }
          else {
            this.orcamentosServicos1.name = ' ';
            this.orcamentosServicos1.price = ' ';
            this.orcamentosServicos1.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[2]) {
            this.orcamentosServicos2 = this.orcamentoView.orcamentoServicos[2];
            this.orcamentosServicos2.price = this.orcamentosServicos2.price + ',00';
          }
          else {
            this.orcamentosServicos2.name = ' ';
            this.orcamentosServicos2.price = ' ';
            this.orcamentosServicos2.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[3]) {
            this.orcamentosServicos3 = this.orcamentoView.orcamentoServicos[3];
            this.orcamentosServicos3.price = this.orcamentosServicos3.price + ',00';
          }
          else {
            this.orcamentosServicos3.name = ' ';
            this.orcamentosServicos3.price = ' ';
            this.orcamentosServicos3.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[4]) {
            this.orcamentosServicos4 = this.orcamentoView.orcamentoServicos[4];
            this.orcamentosServicos4.price = this.orcamentosServicos4.price + ',00';
          }
          else {
            this.orcamentosServicos4.name = ' ';
            this.orcamentosServicos4.price = ' ';
            this.orcamentosServicos4.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[5]) {
            this.orcamentosServicos5 = this.orcamentoView.orcamentoServicos[5];
            this.orcamentosServicos5.price = this.orcamentosServicos5.price + ',00';
          }
          else {
            this.orcamentosServicos5.name = ' ';
            this.orcamentosServicos5.price = ' ';
            this.orcamentosServicos5.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[6]) {
            this.orcamentosServicos6 = this.orcamentoView.orcamentoServicos[6];
            this.orcamentosServicos6.price = this.orcamentosServicos6.price + ',00';
          }
          else {
            this.orcamentosServicos6.name = ' ';
            this.orcamentosServicos6.price = ' ';
            this.orcamentosServicos6.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[6]) {
            this.orcamentosServicos6 = this.orcamentoView.orcamentoServicos[6];
            this.orcamentosServicos6.price = this.orcamentosServicos6.price + ',00';
          }
          else {
            this.orcamentosServicos6.name = ' ';
            this.orcamentosServicos6.price = ' ';
            this.orcamentosServicos6.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[7]) {
            this.orcamentosServicos7 = this.orcamentoView.orcamentoServicos[7];
            this.orcamentosServicos7.price = this.orcamentosServicos7.price + ',00';
          }
          else {
            this.orcamentosServicos7.name = ' ';
            this.orcamentosServicos7.price = ' ';
            this.orcamentosServicos7.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[8]) {
            this.orcamentosServicos8 = this.orcamentoView.orcamentoServicos[8];
            this.orcamentosServicos8.price = this.orcamentosServicos0.price + ',00';
          }
          else {
            this.orcamentosServicos8.name = ' ';
            this.orcamentosServicos8.price = ' ';
            this.orcamentosServicos8.qty = ' ';
            console.log('a');
          }
      
          if (this.orcamentoView.orcamentoServicos[9]) {
            this.orcamentosServicos9 = this.orcamentoView.orcamentoServicos[9];
            this.orcamentosServicos9.price = this.orcamentosServicos0.price + ',00';
          }
          else {
            this.orcamentosServicos9.name = ' ';
            this.orcamentosServicos9.price = ' ';
            this.orcamentosServicos9.qty = ' ';
            console.log('a');
          }
          
          
          if (this.usuarioPessoal.endereco) {
            this.usuarioEndereco = this.usuarioPessoal.endereco;
          }
          else {
            this.usuarioEndereco = ' ';
          }
          
          if(this.orcamentoView.orcamento.full_name){
            this.clienteFullName = this.orcamentoView.orcamento.full_name;

          }
          else{
            this.clienteFullName = ' ';
          }

          if(this.orcamentoView.orcamento.email){
            this.clienteEmailOrcamento = this.orcamentoView.orcamento.email;
          }
          else{
            this.clienteEmailOrcamento = ' ';
          }
          
          if(this.orcamentoView.orcamento.phone){
            this.clientePhone = this.orcamentoView.orcamento.phone;
          }
          else{
            this.clientePhone = ' ';
          }

          if(this.orcamentoView.orcamento.address){
            this.clienteAddress = this.orcamentoView.orcamento.address;
          }
          else{
            this.clienteAddress = ' ';
          }
      
        }
      });
  }

  public getUsuarioPessoal() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id: this.userId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/getUsuarioPessoal';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data) {
          console.log(data);
          this.usuarioPessoal = data[0];
          this.getUsuarioProfissional();
        }
      });
  }
}
