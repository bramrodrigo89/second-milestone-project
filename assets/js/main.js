

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

function newsArticlesHTML(news) {
    if (news.length == 0) {
        return `<div>Currently no news listed</div>`
    }

    var articleItems = news.map(function (newsItem) {

        var articleDateTime = new Date(newsItem.datetime).toLocaleString("en-US").toString();
        return `<li><strong>${articleDateTime}</strong> ${newsItem.source}: <a href='${newsItem.url}' target='_blank'>${newsItem.headline}</a></li>`
    })

    return `<ul>
                ${articleItems.join('\n')}
            </ul>`
}

function createStockChart(data, company) {
    var graphData = data.chart;
    var timeLabels = [];
    var graphDataSet = [];

    graphData.forEach(function (item) {
        timeLabels.push(item.label);
        graphDataSet.push(item.close)
    });

    var ctx = document.getElementById('myChart').getContext('2d');
    var stockChart = new Chart(ctx, {

        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: company,
                backgroundColor: 'rgb(83, 207, 85',
                borderColor: 'rgb(83, 207, 85)',
                data: graphDataSet
            }]
        },

        // Configuration options go here, empty at this time
        options: {}
    });
}

function stockDataToDocument(company, type) {

    getStockData(company, type, function(stockData){
        
        // fetch quote data for summary table

        $('#company-name').html(stockData.quote.companyName);
        $('#company-symbol').html(stockData.quote.symbol);
        
        var latest_price= stockData.quote.latestPrice.toFixed(2);
        $('#last-price').html(latest_price);
        
        var price_change = stockData.quote.change.toFixed(2);
        $('#price-change').html(price_change);

        var price_change_percent = stockData.quote.changePercent*100;
        $('#price-change-percent').html(price_change_percent.toFixed(2));

        $('#latest-time').html(stockData.quote.latestTime);
        $('#last-trade-time').html(stockData.quote.lastTradeTime);
        $('#previous-close').html(stockData.quote.previousClose.toFixed(2));
        
        var market_cap= (stockData.quote.marketCap/Math.pow(10, 9)).toFixed(2);
        $('#market-cap').html(market_cap);

        $('#pe-ratio').html(stockData.quote.peRatio);

        var avg_total_volume = stockData.quote.avgTotalVolume.toLocaleString();
        $('#avg-total-volume').html(avg_total_volume);
        
        // create graph with obtained data
        
        createStockChart(stockData, company)

        // fetch news data from selected stock

        $('#news-ticker').html(newsArticlesHTML(stockData.news));

    });
}
