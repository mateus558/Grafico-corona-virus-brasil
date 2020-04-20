
var url_request = "https://corona.lmao.ninja/v2/historical/brazil?lastdays=all";

function fillCoronaChart(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
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
            var chart = new Chart(ctx, config);
            chart.render();
    }
    xmlHttp.open("GET", url_request, true); // true for asynchronous 
    xmlHttp.send();
    setTimeout(fillCoronaChart, 700000);
}

window.onload = function () {
    this.fillCoronaChart();
}