google.charts.load('45', {'packages':['corechart']});
google.charts.setOnLoadCallback(startApp);


function startApp(){

    // var firebase = require('firebase');

    // console.log(firebase)

    // Configuração do firebase
    var config = {
      apiKey: "Ueg2FauUYoox0pu2R8sYugfm2Filr7yBGXPzw5kx",
      databaseURL: "monitoramentocombustivel.firebaseio.com",
    };


    // Initialize Firebase
    firebase.initializeApp(config);
    var db = firebase.database();

    // console.log(db);

    // Cria os listeners dos dados no firebase
    var tempRef = db.ref('/Volume');
    var volRef = db.ref('/Volume');

    console.log(volRef);

    // Registra as funções que atualizam os gráficos e dados atuais da telemetria
    tempRef.on('value', onNewData('currentVol', 'volLineChart' , 'Volume', 'mL'));
    volRef.on('value', percent('currentPercent', 'percLineChart' , 'Volume', '%'));


}


// Retorna uma função que de acordo com as mudanças dos dados
// Atualiza o valor atual do elemento, com a metrica passada (currentValueEl e metric)
// e monta o gráfico com os dados e descrição do tipo de dados (chartEl, label)
function onNewData(currentValueEl, chartEl, label, metric){

  return function(snapshot){
    var readings = snapshot.val();
    total_litros = 2000
    if(readings){

        var currentValue;
        var data = [];
        for(var key in readings){
          currentValue = readings[key]
          data.push(currentValue);
        }

        document.getElementById(currentValueEl).innerText = currentValue + ' ' + metric;

        buildLineChart(chartEl, label, data);
    }


  }
}
function percent(currentValueEl, chartEl, label, metric){

  return function(snapshot){
    var readings = snapshot.val();
    total_litros = 2000
    if(readings){

        var currentValue;
        var data = [];
        for(var key in readings){
          currentValue = readings[key]
          data.push(currentValue);
        }

        porcentagem = (currentValue/total_litros)*100
        document.getElementById(currentValueEl).innerText = porcentagem + ' ' + metric;


        buildLineChart(chartEl, label, data);
    }

  }
}


// Constroi um gráfico de linha no elemento (el) com a descrição (label) e os
// dados passados (data)
function buildLineChart(el, label, arrayData){
  var data = new google.visualization.DataTable();

  var finalData = [];
  for (let i = 0; i < arrayData.length; i++) {
    finalData.push([i+1,parseFloat(arrayData[i])]);
  }

  console.log(finalData);

  data.addColumn('number', 'Tempo');
  data.addColumn('number', 'Volume');
  data.addRows(finalData);

  var options = {
    //title: 'Histórico',
    //curveType: 'function',
    //width: 900,
    //height: 500,
    hAxis: {
      title: 'Incremento'
    },
    vAxis: {
      title: 'Volume (ml)' ,
      gridlines: {
        count: 10
      },
      ticks: [0,200,400,600,800,1000,1200,1400,1600,1800,2000],
    },
    legend: { position: 'right' }
  };

  var chart = new google.visualization.LineChart(document.getElementById(el));

  chart.draw(data, options);
}
