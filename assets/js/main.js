function getStockData(company,cb) { 
    
    const sandboxAPI = 'https://sandbox.iexapis.com/'
    const version = 'stable/stock/'
    const tokenURL= 'token=Tsk_22c4304dbda24a059f9e35d3f3ee96c9'

    var endPoint = '/quote?'
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", sandboxAPI+version+company+endPoint+tokenURL); 
    xhr.send(); 

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { 
            cb(JSON.parse(this.responseText)); 
        }
    };
}


function writeToDocument(company) {
    var mv = document.getElementById('market-value');
    getStockData(company, function(stockData){
        
        var company_name = stockData.companyName;
        var company_symbol = stockData.symbol;
        var real_time_price = (stockData.isUSMarketOpen == 'true')? stockData.iexRealTimePrice : stockData.latestPrice;
        var price_change = stockData.change;
        var price_change_percent = stockData.changePercent;
        var latest_time = stockData.latestTime;
        var last_trade_time = stockData.lastTradeTime;
        var latest_price= stockData.latestPrice;
        var market_cap= (stockData.marketCap/Math.pow(10, 9)).toFixed(2);
        var pe_ratio = stockData.peRatio;
        var avg_total_volume = stockData.avgTotalVolume;
        
        document.getElementById('company-name').innerHTML = company_name;
        document.getElementById('company-symbol').innerHTML = company_symbol;
        document.getElementById('real-time-price').innerHTML = real_time_price;
        document.getElementById('price-change').innerHTML = price_change;
        document.getElementById('price-change-percent').innerHTML = price_change_percent;
        document.getElementById('latest-time').innerHTML = latest_time;
        document.getElementById('last-trade-time').innerHTML = last_trade_time;
        document.getElementById('latest-price').innerHTML = latest_price;
        document.getElementById('market-cap').innerHTML = market_cap;
        
    });
    
}
