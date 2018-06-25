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
  custosHoraSalvo: any;
  todos = false;
  userId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http) {
    this.userId = this.navParams.get("userId");
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
    if(this.gMensais &&  this.hTrabalhadas && this.custosFixos && this.totalCustos && this.custosHora && this.custosInsumos && this.totalInsumos && this.custosAjudantes && this.totalAjudantes && this.hExecucao && this.imposto && this.lucro){
      this.todos = true;
    }
    if(this.calcular() && this.todos == true){
      this.alterarTab('relatGerado');
    }
    console.log(this.todos);
    
    
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
    console.log(custoH);
    
    if((((this.totalHoras* this.hExecucao)-(custoH * this.hExecucao))-((this.totalHoras* this.hExecucao)*(this.imposto / 100))) > ((custoH * this.hExecucao)+((this.totalHoras* this.hExecucao)*(this.imposto / 100))+((this.totalHoras* this.hExecucao)*(this.lucro / 100)))){
      return this.totalHoras * this.hExecucao;
    } else {
      return ((custoH * this.hExecucao)+((this.totalHoras* this.hExecucao)*(this.imposto / 100))+((this.totalHoras* this.hExecucao)*(this.lucro / 100)));
    }
  }
  alterarTab(tabId){
    this.pageId = tabId;
    console.log(this.pageId);
  }
  public salvarHoras(){
    console.log(this.totalCustos);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      horasTrabalhadas: this.hTrabalhadas,
      ganhosMensais: this.gMensais,
      totalHoras: this.totalHoras,
      custosFixos: this.totalCustos,
      custosHora: this.custosHora,
      userId: this.userId
    }

    var link = 'https://bluedropsproducts.com/app/ferramentas/setHoras';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if(data){
          this.hTrabalhadasSalvo = data.horas_trabalhadas;
          this.gMensaisSalvo = data.ganhos_mensais;
          this.totalHorasSalvo = data.total_horas;
          this.custosFixosSalvos = data.custos_fixos_val;
          this.custosHoraSalvo = data.custos_hora;
          this.alterarTab('horas_o');
        } 
      });
    }
}
