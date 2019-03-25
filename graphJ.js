var listaDeAcoes = [];
var diaAtual;

function calleverthing(empresa, Inicial){
	var linkJ = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + empresa + ".SA&interval=5min&apikey=PN6ZAMT6VK4BZTFU"
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = createCallback(empresa, Inicial);
	xmlhttp.open("GET", linkJ, true);
	xmlhttp.send();
}

function createButtons(empresa){
	var parentElement, botao, botaoAPP;
	parentElement = document.getElementById('graficosBotoes');
	botao = document.createElement('input');
	botaoAPP = parentElement.appendChild(botao);
       botaoAPP.setAttribute('value', empresa);
	var emp = "printGraf("+'"'+empresa+'"'+")";
       botaoAPP.setAttribute('onclick', emp);
	botaoAPP.setAttribute('type', 'button');


}


function fillTable(dados){
	var parentElement;
	var grupo, dado, grupoAAP, dadoAPP;
	parentElement = document.getElementById('tabelaA');
	for(let comp of dados){
		grupo = document.createElement('tr');
		grupoAPP = parentElement.appendChild(grupo);
		for(let inf of comp){
       			dado = document.createElement('td');
			dadoAPP = grupoAPP.appendChild(dado);
			dadoAPP.innerHTML = inf;
		}
	}
};

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

function createCallback(empresa, Inicial) {
 return function(){
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    var serie = myObj["Time Series (5min)"];
    
    var listaJ = [];
    var d = new Date();
    var month = d.getUTCMonth() + 1; //months from 1-12
    var day = d.getUTCDate();
    var year = d.getUTCFullYear();
    var dateString = year +"-" + month +"-" + day + " " + "00:00:01";
    diaAtual = Date.parse(dateString);//Date.parse("2019-03-22 00:00:01");
    
    var ultimoPreco = 0;
    var ultimoPonto = 0;
   
    for(x in serie){
	var hora = Date.parse(x)-7200000;
	if(hora > diaAtual){
		listaJ.unshift([hora, parseFloat(serie[x]["4. close"])]);
	}else{
		if(hora > ultimoPonto){
			ultimoPonto = hora;
			ultimoPreco = parseFloat(serie[x]["4. close"]);
		}
	}
    }

    var Atual = parseFloat(serie[Object.keys(serie)[0]]["4. close"]);
    var Diferenca = Atual - Inicial;
    var Porcet = (Diferenca/Inicial)*100;

    Porcet = Math.round(Porcet * 10) / 10;
    Diferenca = Math.round(Diferenca * 100) / 100;

    var dados = [[empresa,Inicial,Atual,Diferenca,Porcet]];
    fillTable(dados);

    createButtons(empresa);

    listaDeAcoes.push({nome:empresa, lista:listaJ, lastprice:ultimoPreco, myprice:Inicial}); //{type:"Fiat", model:"500", color:"white"}

    //chartJoao2(listaJ, empresa);
    for(x in listaJ){
    	document.getElementById("demo").innerHTML += empresa + " " + listaJ[x][0] + " " + listaJ[x][1] + "<p></p>";
    }

  }
};
}

function printGraf(empresa){
	for(x in listaDeAcoes){
		if(listaDeAcoes[x].nome == empresa){
			chartJoao2(listaDeAcoes[x].lista, listaDeAcoes[x].nome, listaDeAcoes[x].lastprice, listaDeAcoes[x].myprice);
		}

	}
}


function chartJoao2(data, empresa, ultimopreco, meupreco) {
     var valorAtual = data[data.length-1][1];
     var diferenca = valorAtual - ultimopreco;
     var perc = (diferenca/ultimopreco)*100;
     perc = Math.round(perc * 100) / 100;     
     var titulo = empresa +" ("+ perc + "%) R$ "+valorAtual;
     var estiloAzul = {color: '#00F',font: 'bold 18px "Trebuchet MS", Verdana, sans-serif'}
     var estiloVermelho = {color: '#F00',font: 'bold 18px "Trebuchet MS", Verdana, sans-serif'}
     var estilo;
     if(perc >= 0){
        estilo = estiloAzul;
     }else{
	estilo = estiloVermelho;
     }

      Highcharts.chart('container', {
      chart: { zoomType: 'x'},
      title: {text: titulo, style: estilo},
      subtitle: {text: document.ontouchstart === undefined ?'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'},
      xAxis: {type: 'datetime'},
      yAxis: {title: {text: 'Preço R$'}},
      legend: {enabled: false},
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1},

            stops: [[0, Highcharts.getOptions().colors[0]],[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]]},
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: [{
        type: 'area',
        name: 'R$',
        data: data
      },{
        name: 'Fechamento',
        data: [[diaAtual+25200000,ultimopreco],[diaAtual+50400000,ultimopreco]]
      }//,{
       // name: 'Meu preço',
        //data: [[diaAtual+25200000,meupreco],[diaAtual+50400000,meupreco]]
      //}
]
    });
  }
