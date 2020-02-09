//initiate ticker

$('#WebTicker').webTicker();

function getStockData(company, type, cb) { 
    
    const sandboxAPI = 'https://sandbox.iexapis.com/'
    const version = 'stable/stock/'
    const tokenURL= 'token=Tsk_22c4304dbda24a059f9e35d3f3ee96c9'

    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", sandboxAPI+version+company+'/batch?types='+type+'&range=1m&last=15&'+tokenURL); 
    xhr.send(); 

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { 
            cb(JSON.parse(this.responseText)); 
        }
    };
}

function stockDataToDocument(company, type) {

    getStockData(company, type, function(stockData){
        
        // fetch stock quote data for table

        var company_name = stockData.quote.companyName;
        var company_symbol = stockData.quote.symbol;
        var latest_price= stockData.quote.latestPrice.toFixed(2);
        var price_change = stockData.quote.change.toFixed(2);
        var price_change_percent = stockData.quote.changePercent*100;
        var latest_time = stockData.quote.latestTime;
        var last_trade_time = stockData.quote.lastTradeTime;
        var previous_close = stockData.quote.previousClose.toFixed(2);
        var market_cap= (stockData.quote.marketCap/Math.pow(10, 9)).toFixed(2);
        var pe_ratio = stockData.quote.peRatio;
        var avg_total_volume = stockData.quote.avgTotalVolume.toLocaleString();
        
        document.getElementById('company-name').innerHTML = company_name;
        document.getElementById('company-symbol').innerHTML = company_symbol;
        document.getElementById('last-price').innerHTML = latest_price;
        document.getElementById('price-change').innerHTML = price_change;
        document.getElementById('price-change-percent').innerHTML = price_change_percent;
        document.getElementById('latest-time').innerHTML = latest_time;
        document.getElementById('last-trade-time').innerHTML = last_trade_time;
        document.getElementById('previous-close').innerHTML = previous_close;
        document.getElementById('market-cap').innerHTML = market_cap;
        document.getElementById('pe-ratio').innerHTML = pe_ratio;
        document.getElementById('avg-total-volume').innerHTML = avg_total_volume;
        
        // fetch historic data for graph, 1 month by default

        var graphData = stockData.chart;
        var timeLabels = [];
        var graphDataSet = [];

        graphData.forEach(function(item) {
            timeLabels.push(item.label) });
        graphData.forEach(function(item) {
            graphDataSet.push(item.close) });
        
        // create graph with obtained data

        var ctx = document.getElementById('myChart').getContext('2d');
        var stockChart = new Chart(ctx, {

            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: company_name,
                    backgroundColor: 'rgb(83, 207, 85',
                    borderColor: 'rgb(83, 207, 85)',
                    data: graphDataSet
                }]
            },

            // Configuration options go here, empty at this time
            options: {}
        });

        // fetch news data from selected stock

        var newsData = stockData.news;
        console.log(newsData);


    });
}
