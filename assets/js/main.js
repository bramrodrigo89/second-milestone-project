// define constants and variables 

const testAPI = 'https://sandbox.iexapis.com/'
const realAPI = 'https://cloud.iexapis.com/'
const version = 'stable/stock/'
const testToken= 'token=Tpk_2cb28d1e81034940b4058a5d063b25a5'
const realToken = 'token=pk_45af954261be4449955cbefadc328b65'
var stockChart;
var recentSymbolArray = []

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
    
    stockChart = new Chart(ctx, {

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

// Fetch quote data for summary table

function quoteDataVariables(data) {

    var quoteData = data.quote;
    console.log(quoteData);
    var latest_price = quoteData.latestPrice.toFixed(2);
    var price_change = quoteData.change.toFixed(2);
    var price_change_percent = quoteData.changePercent * 100;
    var market_cap = (quoteData.marketCap / Math.pow(10, 9)).toFixed(2);
    var avg_total_volume = quoteData.avgTotalVolume.toLocaleString();
    var latest_time = quoteData.latestTime.toLocaleString();
    var extended_time = new Date(quoteData.extendedPriceTime).toLocaleTimeString('en-US');
    var recentSymbol = {symbol:quoteData.symbol, name:quoteData.companyName}

    $('#company-name').html(quoteData.companyName);
    $('#company-symbol').html(quoteData.symbol);
    $('#last-price').html(latest_price);    
    $('#price-change').html(price_change);
    $('#52-week-range').html(`${quoteData.week52Low} - ${quoteData.week52High}`);
    $('#primary-exchange').html(quoteData.primaryExchange)
    $('#price-change-percent').html(price_change_percent.toFixed(2));
    $('#previous-close').html(quoteData.previousClose.toFixed(2));
    $('#market-cap').html(market_cap);
    $('#pe-ratio').html(quoteData.peRatio);
    $('#avg-total-volume').html(avg_total_volume);
    $('#ytd-change').html(`${quoteData.ytdChange.toFixed(4)*100} %`);

    if (quoteData.open = 'null') {
        $('#open-price').html(`N/A`);
    } else {
        $('#open-price').html(quoteData.open);
    }

    if (price_change > 0) {
        $('.green-or-red').addClass('text-success');
        $('.green-or-red').removeClass('text-danger text-secondary');
        $('#plus-or-minus').html('+');
    } else if (price_change < 0) { 
        $('.green-or-red').addClass('text-danger');
        $('.green-or-red').removeClass('text-success text-secondary');
        $('#plus-or-minus').html('');
    } else if (!price_change) {
        $('.green-or-red').addClass('text-secondary');
        $('.green-or-red').removeClass('text-success text-danger');
        $('#plus-or-minus').html('0.00');
    }
    
    if (quoteData.isUSMarketOpen === true) {
        $('#latest-time').html(`${quoteData.latestSource} as of ${latest_time}`);
        $('#latest-source').html('');
    } else {
        $('#latest-time').html(`<i class="fas fa-moon"></i>   <strong>Closed:</strong> Last price as of ${latest_time}`);
        $('#extended-price').html(`<h5><strong>After hours:</strong> ${quoteData.extendedPrice} US$ <small id='extended-change'>${quoteData.extendedChange} US$ (${quoteData.extendedChangePercent*100} %)</small></h5> <p class='small'>Extended price as of ${extended_time}</p?`)
    }

}

// Fetch profile data for company summary

function profileData(data) {

    var profileData = data.company;
    console.log(profileData);
}

// Main function that combines all previous functions

function stockDataToDocument(event) {
    var company = $('#symbolInputText').val();

    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = testAPI;
        var keyToken = testToken
    } else {
        var baseURL = realAPI;
        var keyToken = realToken}

    if (!company) {
        $("#message-error").html(`<h4>Please enter a valid symbol</h4>`);
        return;
    } else (

    $("#search-symbol-button").html(
        `<button class="btn btn-info" type="button" disabled>
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Loading...
        </button>`)
    )

    $.when(
        $.getJSON(`${baseURL}${version}${company}/batch?types=company,logo,quote,chart,news&range=5d&last=8&${keyToken}`),

    ).then(
        function(response) {
            $("#message-error").html('')
            $('#search-symbol-button').html(
                `<button type="submit" class="btn btn-info" onclick="stockDataToDocument()">
                    Search
                </button>`
            )
            var stockData = response;
            quoteDataVariables(stockData);
            $('#company-logo').attr('src',response.logo.url);
            profileData(stockData);
            createStockChart(stockData, company);
            $('#news-ticker').html(newsArticlesHTML(stockData.news));
            $('.update-chart-button').click(function(){
                var range = this.innerText.toLowerCase();
                $.when(
                    $.getJSON(`${testAPI}${version}${company}/batch?types=chart&range=${range}&${testToken}`)
                ).then(
                    function (response) {
                        stockChart.destroy();
                        var updatedChartData = response;
                        createStockChart(updatedChartData, company);
                    }
                )
            });
            
        }, function(errorResponse) {
            $("#message-error").html(`<h4>Please enter a valid symbol</h4>`);
            $('#search-symbol-button').html(
                `<button type="submit" class="btn btn-info" onclick="stockDataToDocument()">
                    Search
                </button>`
            )
        }
    )
    // uncomment this when needed 
    // console.log(recentSymbolArray);
}

$(document).ready(function() {
    $('#symbolInputText').val('aapl');
    stockDataToDocument();
    $('#symbolInputText').val('');
})
