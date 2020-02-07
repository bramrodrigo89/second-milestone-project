function getStockData(company, type, cb) { 
    
    const sandboxAPI = 'https://sandbox.iexapis.com/'
    const version = 'stable/stock/'
    const tokenURL= 'token=Tsk_22c4304dbda24a059f9e35d3f3ee96c9'

    switch (type) {
        case 'intra-day':
            var datatype = '/intra-day?'
        break;
        case 'quote':
            var datatype = '/quote?'
        break;
        default:
            var datatype = '/quote?'
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", sandboxAPI+version+company+datatype+tokenURL); 
    console.log(sandboxAPI+version+company+datatype+tokenURL);
    xhr.send(); 

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { 
            cb(JSON.parse(this.responseText)); 
        }
    };
}


function quoteDataToDocument(company, type) {

    getStockData(company, type, function(stockData){
        
        var company_name = stockData.companyName;
        var company_symbol = stockData.symbol;
        var latest_price= stockData.latestPrice.toFixed(2);
        var price_change = stockData.change;
        var price_change_percent = stockData.changePercent*100;
        var latest_time = stockData.latestTime;
        var last_trade_time = stockData.lastTradeTime;
        var previous_close = stockData.previousClose.toFixed(2);
        var market_cap= (stockData.marketCap/Math.pow(10, 9)).toFixed(2);
        var pe_ratio = stockData.peRatio;
        var avg_total_volume = stockData.avgTotalVolume;
        
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
        
        console.log(stockData);
    });
}

function graphDataToDocument(company, type) {

    getStockData(company, type, function(stockData){
        console.log(stockData);
    });
};