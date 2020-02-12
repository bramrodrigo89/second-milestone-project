const sandboxAPI = 'https://sandbox.iexapis.com/'
const realAPI = 'https://cloud.iexapis.com/'
const version = 'stable/stock/'
const testToken= 'token=Tpk_2cb28d1e81034940b4058a5d063b25a5'
const realToken = 'token=pk_45af954261be4449955cbefadc328b65'

function getStockData(company, type, cb) { 
    
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

    var ctx = document.getElementById('stockChart').getContext('2d');
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
    })

}

function updateStockChart(time) {

}

function stockDataToDocument(company, type) {

    getStockData(company, type, function(stockData){
        
        // fetch quote data for summary table

        var quoteData = stockData.quote;

        $('#company-name').html(quoteData.companyName);
        $('#company-symbol').html(quoteData.symbol);
        
        var latest_price= quoteData.latestPrice.toFixed(2);
        $('#last-price').html(latest_price);
        
        var price_change = quoteData.change.toFixed(2);
        $('#price-change').html(price_change);

        var price_change_percent = quoteData.changePercent*100;
        $('#price-change-percent').html(price_change_percent.toFixed(2));

        $('#latest-time').html(quoteData.latestTime);
        $('#last-trade-time').html(quoteData.lastTradeTime);
        $('#previous-close').html(quoteData.previousClose.toFixed(2));
        
        var market_cap= (quoteData.marketCap/Math.pow(10, 9)).toFixed(2);
        $('#market-cap').html(market_cap);

        $('#pe-ratio').html(quoteData.peRatio);

        var avg_total_volume = quoteData.avgTotalVolume.toLocaleString();
        $('#avg-total-volume').html(avg_total_volume);
        
        // create graph with obtained data
        
        createStockChart(stockData, company);

        // fetch news data from selected stock

        $('#news-ticker').html(newsArticlesHTML(stockData.news));

        $('.update-chart-button').click(function(){
            var range = this.innerText.toLowerCase();

            var updateXHR = new XMLHttpRequest();
            updateXHR.open("GET", sandboxAPI+version+company+'/batch?types=chart&range='+range+'&'+testToken); 
            updateXHR.send(); 
            updateXHR.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var updatedChartData = JSON.parse(this.responseText);
                    createStockChart(updatedChartData, company);
                }
            };
            
        });

    });
}

$(document).ready(stockDataToDocument('AAPL', 'quote,chart,news'));
