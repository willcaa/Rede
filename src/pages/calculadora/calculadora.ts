import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
/**
 * Generated class for the CalculadoraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculadora',
  templateUrl: 'calculadora.html',
})
export class CalculadoraPage {
  totalCustosI: number;
  totalCustosA: number;
  totalHorasVal: number;
  totalImposto: number;
  totalLucro: number;
  totalCapital: number;
  hExecucao: any;
  imposto: any;
  lucro: any;
  totalHoras: any;
  totalCustos: number = 0;
  totalInsumos: number = 0;
  totalAjudantes: number = 0;
  custosHora: number = 0;
  gMensais: number;
  hTrabalhadas: number;
  nCustoDesc: any;
  nCustoValor: any;
  nInsumoDesc: any;
  nInsumoValor: any;
  nAjudanteDesc: any;
  nAjudanteValor: any;
  pageId: any;
  custosFixos: any = [];
  custosFixosSalvos: any = [];
  custosInsumos: any = [];
  custosAjudantes: any = [];
  precoSugerido: number;
  data = [];
  dataget: any;
  gMensaisSalvo: any;
  hTrabalhadasSalvo: any;
  totalHorasSalvo: any;
  custosFixosSalvo: any = [];
  custosFixosSalvoTotal: any;
  custoTotalFinal: any;
  custosHoraSalvo: any;
  todos = false;
  mensagem = false;
  dadosSalvos: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

     this.dadosSalvos = this.storage.get('usuario')
        .then( res =>{
            console.log(res);
            if(res != null){
              this.gMensaisSalvo = res[0].ganhosMensais;
              this.hTrabalhadasSalvo = res[1].horasTrabalhadas;
              this.totalHorasSalvo = res[2].totalHoras;
              this.custosFixosSalvo = res[3].custosFixos;
              this.custosHoraSalvo = res[4].custosHora;
              let p = 0;
              res[3].custosFixos.forEach(element => {
                p = p + parseInt(element.val);
              });
              this.custosFixosSalvoTotal = p;
              this.alterarTab('horas_o');
              return res;
            } else {
              this.alterarTab('calcHoras');

            }
            
          } 
        );
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculadoraPage');
  }

  sumGanhos(){
    if(this.gMensais && this.hTrabalhadas){
      this.totalHoras = Math.trunc(this.gMensais / this.hTrabalhadas);
    }
  }

 addFixos(){
    if(this.nCustoDesc && this.nCustoValor){
      var custoN = [];
      custoN['desc'] = this.nCustoDesc;
      custoN['val'] = this.nCustoValor;
      console.log(custoN);

      this.custosFixos.push(custoN);
      this.totalCustos = this.totalCustos + parseInt(this.nCustoValor);
      this.nCustoDesc = "";
      this.nCustoValor = '';
      this.custosHora = Math.trunc(this.totalCustos / this.hTrabalhadas);
    }
  }
  remFixos(id){
    if(this.custosFixos){
      this.custosFixos =  this.custosFixos.filter(function(el) { 
        return el !== id; 
      });
      this.totalCustos = this.totalCustos - parseInt(id.val);
      this.custosHora = Math.trunc(this.totalCustos / this.hTrabalhadas);      
      console.log(this.custosFixos, this.totalCustos);
    }
  }

  addInsumos(){
    if(this.nInsumoDesc && this.nInsumoValor){
      var custoN = [];
      custoN['desc'] = this.nInsumoDesc;
      custoN['val'] = this.nInsumoValor;
      this.custosInsumos.push(custoN);
      this.totalInsumos = this.totalInsumos + parseInt(this.nInsumoValor);
      console.log(this.nInsumoValor, this.totalInsumos);
      this.nInsumoDesc = "";
      this.nInsumoValor = '';
    }
  }
  remInsumos(id){
    if(this.custosInsumos){
      this.custosInsumos =  this.custosInsumos.filter(function(el) { 
        return el !== id; 
      });
      this.totalInsumos = this.totalInsumos - parseInt(id.val);
      console.log(this.custosInsumos, this.totalInsumos);
    }
  }

  addAjudantes(){
    if(this.nAjudanteDesc && this.nAjudanteValor){
      var custoN = [];
      custoN['desc'] = this.nAjudanteDesc;
      custoN['val'] = this.nAjudanteValor;
      this.custosAjudantes.push(custoN);
      this.totalAjudantes = this.totalAjudantes + parseInt(this.nAjudanteValor);
      console.log(this.nAjudanteValor, this.totalAjudantes);
      this.nAjudanteDesc = "";
      this.nAjudanteValor = '';
    }
  }
  remAjudantes(id){
    if(this.custosAjudantes){
      this.custosAjudantes =  this.custosAjudantes.filter(function(el) { 
        return el !== id; 
      });
      this.totalAjudantes = this.totalAjudantes - parseInt(id.val);
      console.log(this.custosAjudantes, this.totalAjudantes);
    }
  }

  gerarRelatorio(){
    if(this.gMensaisSalvo &&  this.hTrabalhadasSalvo && this.custosFixosSalvo && this.custosFixosSalvoTotal && this.custosHoraSalvo && this.hExecucao && this.imposto && this.lucro){
      this.todos = true;
      this.mensagem = false;
    } else {
      this.mensagem = true;
    }
    if(this.calcular() && this.todos == true){
      this.alterarTab('relatGerado');
    }
    console.log(this.todos);
    
    
  }
  calcular(){
    let custoH;
    custoH = Math.trunc((this.totalAjudantes + this.totalInsumos)/this.hExecucao);
    this.custoTotalFinal = (custoH + parseInt(this.custosHoraSalvo)) * this.hExecucao;
    let iL = 100 - (parseInt(this.imposto) + parseInt(this.lucro));
    console.log(iL);
    this.precoSugerido = Math.trunc((this.custoTotalFinal*100)/iL);
    this.totalHorasVal = Math.trunc(this.totalHorasSalvo * this.hExecucao);
    this.totalImposto = Math.trunc((this.imposto / 100) * this.precoSugerido);
    this.totalLucro = Math.trunc((this.lucro / 100) * this.precoSugerido);
    this.totalCapital = Math.trunc(this.precoSugerido - this.totalImposto - this.totalLucro);
    console.log(this.precoSugerido, this.totalHorasVal, this.totalLucro);
    return true;
  }

  alterarTab(tabId){
    this.pageId = tabId;
    console.log(this.pageId);
    console.log(this.gMensaisSalvo);
  }
  public salvarHoras(){
    this.data.push({"ganhosMensais": this.gMensais}, {"horasTrabalhadas": this.hTrabalhadas}, {"totalHoras": this.totalHoras}, {"custosFixos": this.custosFixos}, {"custosHora": this.custosHora});
    this.storage.set('usuario', this.data);
    this.gMensaisSalvo = this.gMensais;
    this.hTrabalhadasSalvo = this.hTrabalhadas;
    this.totalHorasSalvo = this.totalHoras;
    this.custosFixosSalvo = this.custosFixos;
    let p = 0;
    this.custosFixos.forEach(element => {
      p = p + parseInt(element.val);
    });
    this.custosFixosSalvoTotal = p;
    this.custosHoraSalvo = this.custosHora;
    this.alterarTab('horas_o');
    console.log(this.data);
  }
  
}
