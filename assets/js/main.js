//initiate ticker

$('#WebTicker').webTicker();

function getStockData(company, type, cb) { 
    
    const sandboxAPI = 'https://sandbox.iexapis.com/'
    const realAPI = 'https://cloud.iexapis.com/'
    const version = 'stable/stock/'
    const testToken= 'token=Tpk_2cb28d1e81034940b4058a5d063b25a5'
    const realToken = 'token=pk_45af954261be4449955cbefadc328b65'

    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", sandboxAPI+version+company+'/batch?types='+type+'&range=1m&last=5&'+testToken); 
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
        document.getElementById('price-change-percent').innerHTML = price_change_percent.toFixed(2);
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
        var news_ticker = document.getElementById('WebTicker')

        var articleItems = [];

        newsData.forEach(function(item) {
            var articleDateTime = new Date(item.datetime).toLocaleString();
            var articleHeadline = item.headline;
            var articleSource = item.source;
            var articleURL = item.url;

            articleItems.push(`<li><strong>${articleDateTime}</strong> ${articleSource}: <a href='${articleURL}' target='_blank'>${articleHeadline}</a></li>\n`)
        })
        articleItems.unshift(`<li class="ticker-spacer">Latest News</li>\n`);
        articleItems.push(`<li class="last">Today's Date here</li>\n`);
        console.log(articleItems);
        news_ticker.append(articleItems);
        
    });
}
