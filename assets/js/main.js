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
    var el = document.getElementById('market-value');
    getStockData(company, function(stockData){
        
        var market_value = stockData.latestPrice

        el.innerHTML= market_value
    });
    
}
