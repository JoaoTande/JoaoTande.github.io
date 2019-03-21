function calleverthing(empresa, Inicial){
	var linkJ = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + empresa + ".SA&interval=5min&apikey=PN6ZAMT6VK4BZTFU"
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = createCallback(empresa, Inicial);
	xmlhttp.open("GET", linkJ, true);
	xmlhttp.send();
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


function createCallback(empresa, Inicial) {
 return function(){
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    var serie = myObj["Time Series (5min)"];
    
    var listaJ = [];
    for(x in serie){
       listaJ.unshift([x, parseFloat(serie[x]["4. close"])]);
    }

    var Atual = parseFloat(serie[Object.keys(serie)[0]]["4. close"]);
    var Diferenca = Atual - Inicial;
    var Porcet = (Diferenca/Inicial)*100;

    var dados = [[empresa,Inicial,Atual,Diferenca,Porcet]];
    fillTable(dados);

    chartJoao2(listaJ, empresa);
    for(x in listaJ){
    	document.getElementById("demo").innerHTML += empresa + " " + listaJ[x][0] + " " + listaJ[x][1] + "<p></p>";
    }

  }
};
}


function chartJoao2(data, empresa) {

     Highcharts.chart('container', {
      chart: { zoomType: 'x'},
      title: {text: empresa},
      subtitle: {text: document.ontouchstart === undefined ?'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'},
      xAxis: {type: 'datetime'},
      yAxis: {title: {text: 'Exchange rate'}},
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
      }]
    });
  }
