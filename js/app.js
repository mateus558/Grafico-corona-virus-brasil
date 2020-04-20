
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yy = today.getFullYear().toLocaleString().slice(-2);
var chart;


function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}
  
function updateTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var x = document.getElementById("update-time");
    x.innerHTML = h + ":" + m + ":" + s;
}

function fillCoronaChart(){
    let url_request = "https://corona.lmao.ninja/v2/historical/brazil?lastdays=all";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var data = JSON.parse(xmlHttp.responseText).timeline;
            cases_data = Object.keys(data.cases).map(key => {
                return data.cases[key];
            });
            cases_labels = Object.keys(data.cases);
            deaths_data = Object.keys(data.deaths).map(key => {
                return data.deaths[key];
            });
            deaths_labels = Object.keys(data.deaths);

            var config = {
                type: 'line',
                data: {
                    labels: cases_labels,
                    datasets: [{
                        label: "Casos confirmados",
                        data: cases_data,
                        backgroundColor: 'rgba(0, 150, 150, 0.3)'
                    },
                    {
                        label:"Mortes",
                        data: deaths_data,
                        backgroundColor: 'rgba(200, 0, 0, 0.6)'
                    }]
                },
                options:{
                    title: {
                        display: true,
                        text: 'Casos do corona virus no Brasil'
                    }
                }
            };

            var ctx = canvas.getContext('2d');
            chart = new Chart(ctx, config);
            chart.render();
        }
    }
    xmlHttp.open("GET", url_request, true); // true for asynchronous 
    xmlHttp.send();
}

function updateCoronaChart(){
    let url_request = "https://corona.lmao.ninja/v2/countries/brazil?yesterday=false&strict=false";

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var data = JSON.parse(xmlHttp.responseText);
            if(mm[0] == '0') mm = mm.slice(-1);
            let label = mm + '/' + dd+'/'+yy;
            for(var i = 0; i < chart.data.labels.length; i++){
                if(chart.data.labels[i] == label) break;
            }
            if(i == chart.data.labels.length){
                chart.data.labels.push(label);
                chart.data.datasets.forEach((dataset) => {
                    if(dataset.label == "Casos confirmados"){
                        dataset.data.push(data.cases);
                    }
                    if(dataset.label == "Mortes"){
                        dataset.data.push(data.deaths);
                    }
                });
                chart.update();
                updateTime();
            }else{
                chart.data.datasets.forEach((dataset) => {
                    if(dataset.label == "Casos confirmados"){
                        if(data.cases != dataset.data[dataset.data.length-1]) updateTime();
                        dataset.data[dataset.data.length-1] = data.cases;
                    }
                    if(dataset.label == "Mortes"){
                        if(data.deaths != dataset.data[dataset.data.length-1]) updateTime();
                        dataset.data[dataset.data.length-1] = data.deaths;
                    }
                });
                chart.update();
            }
        }
    }
    xmlHttp.open("GET", url_request, true); // true for asynchronous 
    xmlHttp.send();
    setTimeout(updateCoronaChart, 700000);
}
window.onload = function () {
    this.fillCoronaChart();
    this.updateCoronaChart();
}