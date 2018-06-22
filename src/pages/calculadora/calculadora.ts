import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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
  custosHoraSalvo: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.get('usuario')
      .then( res =>{
          console.log(res);
          if(res != null){
            this.gMensaisSalvo = res[0].ganhosMensais;
            this.hTrabalhadasSalvo = res[1].horasTrabalhadas;
            this.totalHorasSalvo = res[2].totalHoras;
            this.custosFixosSalvo = res[3].custosFixos;
            this.custosHoraSalvo = res[4].custosHora;
          }
          
        } 
      );

  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculadoraPage');
    if(this.totalHorasSalvo || this.custosHoraSalvo){
      this.alterarTab('horas_o');
    }
    else{
      this.alterarTab('calcHoras')
    }
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
    if(this.calcular()){

      this.alterarTab('relatGerado');
    }
    
  }
  calcular(){
 
    this.precoSugerido = Math.trunc(this.horasVal());
    let precoSug = Math.trunc(this.horasVal());
    this.totalHorasVal = Math.trunc(this.totalHoras * this.hExecucao);
    this.totalImposto = Math.trunc((this.imposto / 100) * precoSug);
    this.totalLucro = Math.trunc((this.lucro / 100) * precoSug);
    this.totalCapital = Math.trunc(precoSug - this.totalImposto - this.totalLucro);
    console.log(precoSug, this.totalHorasVal, this.totalLucro);
    return true;
  }
  horasVal(){
    let custoH;
    custoH = Math.trunc(((this.totalAjudantes + this.totalInsumos)/this.hExecucao) + this.custosHora);
    if((((this.totalHoras* this.hExecucao)-(custoH * this.hExecucao))-((this.totalHoras* this.hExecucao)*(this.imposto / 100))) > ((custoH * this.hExecucao)*((1/(this.imposto / 100))+(((custoH * this.hExecucao)*((1/(this.lucro / 100)))))))){
      return this.totalHoras * this.hExecucao;
    } else {
      return ((custoH * this.hExecucao)*((1/(this.imposto / 100))+(((custoH * this.hExecucao)*((1/(this.lucro / 100)))))));
    }
  }
  alterarTab(tabId){
    this.pageId = tabId;
    console.log(this.pageId);
  }
  public salvarHoras(){
    this.data.push({"ganhosMensais": this.gMensais}, {"horasTrabalhadas": this.hTrabalhadas}, {"totalHoras": this.totalHoras}, {"custosFixos": this.custosFixos}, {"custosHora": this.custosHora});
    this.storage.set('usuario', this.data);
    console.log(this.data);
  }
  
}
