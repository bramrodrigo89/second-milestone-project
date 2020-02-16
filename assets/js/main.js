const testAPI = 'https://sandbox.iexapis.com/'
const realAPI = 'https://cloud.iexapis.com/'
const version = 'stable/stock/'
const testToken= 'token=Tpk_2cb28d1e81034940b4058a5d063b25a5'
const realToken = 'token=pk_45af954261be4449955cbefadc328b65'

function getStockData(company, cb) { 
    
    var type = 'quote,chart,news';
    var xhr = new XMLHttpRequest();
    xhr.open("GET", testAPI+version+company+'/batch?types='+type+'&range=1m&last=8&'+testToken); 
    xhr.send(); 

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { 
            cb(JSON.parse(this.responseText)); 
        }
    };
}

// fetch news data from selected stock

function newsArticlesHTML(news) {
    if (news.length == 0) {
        
        return `<p>Currently no news listed</p>`
    }

    var articleItems = news.map(function (newsItem) {

        var articleDateTime = new Date(newsItem.datetime).toLocaleString("en-US").toString();

        return  `<div class="col mb-4" >
                    <div class="card h-100 bg-dark text-white">
                        <img src="${newsItem.image}" class="card-img-top" alt="Article image">
                        <div class="card-body">
                            <h5 class="card-title">${newsItem.source}</h5>
                            <p class="card-text">${newsItem.headline}</p>
                            <a href="${newsItem.url}" target='_blank' class="btn btn-primary">Read more</a>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">Published: ${articleDateTime}</small>
                        </div>
                    </div>
                </div>`
    })
    
    return articleItems.join('\n')
            
}

 // create graph with obtained data

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
                backgroundColor: 'rgba(83, 207, 85, 0)',
                borderColor: 'rgb(83, 207, 85)',
                data: graphDataSet
            }]
        },

        options: {
            legend: {
                display: true
            }
        }
    })

}

// fetch quote data for summary table

function quoteDataVariables(data) {

    var quoteData = data.quote;
    var latest_price = quoteData.latestPrice.toFixed(2);
    var price_change = quoteData.change.toFixed(2);
    var price_change_percent = quoteData.changePercent * 100;
    var market_cap = (quoteData.marketCap / Math.pow(10, 9)).toFixed(2);
    var avg_total_volume = quoteData.avgTotalVolume.toLocaleString();

    $('#company-name').html(quoteData.companyName);
    $('#company-symbol').html(quoteData.symbol);
    $('#last-price').html(latest_price);    
    $('#price-change').html(price_change);

    if (price_change > 0) {
        $('.green-or-red').addClass('text-success');
        $('#plus-or-minus').html('+');
    } else if (price_change < 0) { 
        $('.green-or-red').addClass('text-danger');
        $('#plus-or-minus').html('');
    } else if (!price_change) {
        $('.green-or-red').addClass('text-secondary');
        $('#plus-or-minus').html('0.00');
    }

    $('#price-change-percent').html(price_change_percent.toFixed(2));
    $('#latest-time').html(quoteData.latestTime);
    $('#last-trade-time').html(quoteData.lastTradeTime);
    $('#previous-close').html(quoteData.previousClose.toFixed(2));
    $('#market-cap').html(market_cap);
    $('#pe-ratio').html(quoteData.peRatio);
    $('#avg-total-volume').html(avg_total_volume);
}

function stockDataToDocument(company) {

    getStockData(company, function(stockData){
        
        quoteDataVariables(stockData);
        createStockChart(stockData, company);
        $('#news-ticker').html(newsArticlesHTML(stockData.news));
        $('.update-chart-button').click(function(){
            var range = this.innerText.toLowerCase();
            $.when(
                $.getJSON(`${testAPI}${version}${company}/batch?types=chart&range=${range}&${testToken}`)
            ).then(
                function (firstResponse) {
                    var updatedChartData = firstResponse;
                    createStockChart(updatedChartData, company);
                }
            )
        })
    });
};

$(document).ready(stockDataToDocument('AAPL', 'quote,chart,news'));
