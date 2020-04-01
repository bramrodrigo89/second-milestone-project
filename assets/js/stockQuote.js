// Define constants and variables 

const testAPI = 'https://sandbox.iexapis.com/'
const realAPI = 'https://cloud.iexapis.com/'
const version = 'stable/stock/'
const testToken= 'token=Tpk_2cb28d1e81034940b4058a5d063b25a5'
const realToken = 'token=pk_45af954261be4449955cbefadc328b65'
var stockChart;
var cachedWatchList = JSON.parse(localStorage.getItem("myWatchList"))
var watchedStockSymbolToLookUp = JSON.parse(localStorage.getItem("watchedStockToLookUp"))
if (cachedWatchList == null) {
    var watchListArray=[];
} else {
    var watchListArray = cachedWatchList;
}

// Check if switch is checked to activate API Sandbox

function isSwitchChecked() {
    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = testAPI;
        var keyToken = testToken
    } else {
        var baseURL = realAPI;
        var keyToken = realToken}

}

// fetch news data from selected stock

function newsArticlesHTML(news) {

    if (news.length == 0) {
        
        return `<p>Currently no recent news listed for this company!</p>`
    }

    var articleItems = news.map(function (newsItem) {

        var articleDateTime = new Date(newsItem.datetime).toLocaleString("en-US").toString();

        return  `<div class="col mb-4" >
                    <div class="card bg-dark text-white">
                        <img src="${newsItem.image}" class="card-img-top" alt="Article image">
                        <div class="card-body">
                            <h5 class="card-title">${newsItem.source}</h5>
                            <p class="card-text">${newsItem.headline}</p>
                            <a href="${newsItem.url}" target='_blank' class="btn btn-info">Read more</a>
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
                display: false,
            },
            maintainAspectRatio: false
        }
    })

}

// Fetch quote data for summary table

function quoteDataVariables(data) {

    var quoteData = data.quote;
    var latest_price = quoteData.latestPrice.toFixed(2);
    var price_change = quoteData.change.toFixed(2);
    var price_change_percent = quoteData.changePercent * 100;
    var market_cap = (quoteData.marketCap / Math.pow(10, 9)).toFixed(1);
    var avg_total_volume = quoteData.avgTotalVolume.toLocaleString();
    var latest_time = quoteData.latestTime.toLocaleString();
    var ytd_change = quoteData.ytdChange*100;
    
    var recentSymbol = {symbol:quoteData.symbol, name:quoteData.companyName}

    $('.company-name').html(quoteData.companyName);
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
    $('#ytd-change').html(ytd_change.toFixed(2)+' %');

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
    } else if (quoteData.isUSMarketOpen === false) {
        $('#latest-time').html(`<i class="fas fa-moon"></i>   <strong>Closed:</strong> Last price as of ${latest_time}`);
        if (quoteData.extendedPrice = !'null') {
            var extended_time = new Date(quoteData.extendedPriceTime).toLocaleTimeString('en-US');
            $('#extended-price').html(`<h6><strong>After hours:</strong> ${quoteData.extendedPrice} US$ <small id='extended-change'>${quoteData.extendedChange} US$ (${quoteData.extendedChangePercent*100} %)</small></h6> <p class='small'>Extended price as of ${extended_time}</p?`);
        } else if (quoteData.extendedPrice = 'null') {
            $('#extended-price').html('<h6><strong>After hours:</strong> N/A</h6>');
        }
    }
}

// Fetch profile data for company summary

function profileData(data) {

    var profileData = data.company;
    var tags = profileData.tags;
    $('#profile-description').html(profileData.description);
    $('#contact-information').html(`
        <table class="table table-sm table-dark mb-0">
            <tbody>
                <tr> 
                    <th scope="row">Website</th>
                    <td><a target='_blank' href='${profileData.website}'><span class="badge badge-info">${profileData.companyName}</span></a></td>
                </tr>
                <tr>
                    <th scope="row">CEO</th>
                    <td>${profileData.CEO}</td>
                </tr>
                <tr>
                    <th scope="row">Address</th>
                    <td>${profileData.address}</td>
                </tr>
                <tr>
                    <th scope="row">City</th>
                    <td>${profileData.city}</td>
                </tr>
                <tr>
                    <th scope="row">Zip</th>
                    <td>${profileData.zip}</td>
                </tr>
                <tr>
                    <th scope="row">Country</th>
                    <td>${profileData.country}</td>
                </tr>
                <tr>
                    <th scope="row">Phone</th>
                    <td>${profileData.phone}</td>
                </tr>
            </tbody>
        </table>
    `);
    $('#industry-information').html(`
        <p><span class="font-weight-bold text-large">Tags: </span><a target='_blank' href="http://www.google.com/search?q=%22${tags[0].replace(/\s/g, '+')}%22"><span class="badge badge-info m-2">${tags[0]}</span></a><a target='_blank' href="http://www.google.com/search?q=%22${tags[1].replace(/\s/g, '+')}%22"><span class="badge badge-info m-2">${tags[1]}</span></a></p>
        <p><span class="font-weight-bold text-large">Industry: </span><span class="font-weight-light">${profileData.industry}</span></p>
        <p><span class="font-weight-bold text-large">Sector: </span><span class="font-weight-light">${profileData.sector}</span></p>
    `);
    $('#company-logo-link').attr('href',profileData.website)
}

// Object constructor for currently displayed stocks

function CurrentStock (sym,company) {
    this.symbol = sym;
    this.name = company;
}

// Check if stock is already in watch list

function isStockWatched(stockList, stock, sym) {
    var upperCaseSym = sym.toUpperCase();
    if (stockList.some(stock => stock.symbol===upperCaseSym)) {
        return true
    } else {
        return false
    }
}

function normalSearchButton() {
    $("#loading-symbol").html('');
    $('#search-symbol-button').html(
        `<button id='search-stockSymbol-button' type="submit" class="btn btn-info mt-2" onclick="stockDataToDocument()">
            Search
        </button>`);
}

// Main function which brings all collected quote information to the page
// and combines all previous functions 

function stockDataToDocument(entry) {

    if (entry === undefined || entry == null) 
    {var company = $('#symbolInputText').val();} 
    else {var company = entry}
    
    isSwitchChecked()
    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = testAPI;
        var keyToken = testToken
    } else {
        var baseURL = realAPI;
        var keyToken = realToken}

    if (!company) {
        normalSearchButton();
        $('#search-stock-information').addClass('d-none');
        $('#exampleModal').modal('show');
        return
    } else (
    $("#search-symbol-button").html(
        `<button class="btn btn-info mt-2" type="button" disabled>
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Loading...
        </button>`)
    )
    $('#loading-symbol').html(`
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-info m-5" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`);
    $('#search-stock-information').addClass('d-none');

    $.when(
        $.getJSON(`${baseURL}${version}${company}/batch?types=company,logo,quote,chart,news&range=5d&last=8&${keyToken}`),

    ).then(
        function(response) {
            setTimeout(normalSearchButton,900)
            $('#search-stock-information').removeClass('d-none');
            var stockData = response;
            quoteDataVariables(stockData);
            $('#company-logo').attr('src',stockData.logo.url);
            profileData(stockData);
            createStockChart(stockData, company);
            $('#news-ticker').html(newsArticlesHTML(stockData.news));
            $('.update-chart-button').click(function(){
                var range = this.innerText.toLowerCase();
                $.when(
                    $.getJSON(`${baseURL}${version}${company}/batch?types=chart&range=${range}&${keyToken}`)
                ).then(
                    function (response) {
                        stockChart.destroy();
                        var updatedChartData = response;
                        createStockChart(updatedChartData, company);
                    }
                )
            });
            var displayedStock = JSON.parse(JSON.stringify(new CurrentStock ($('#company-symbol').html(),$('.company-name').html()))); 
            
            if (isStockWatched(watchListArray, displayedStock, company)) {
                $('#text-before-star').html('Remove from my ');
                $('#watch-list-star').addClass('fas');
            } else {
                $('#text-before-star').html('Add to my ');
                $('#watch-list-star').removeClass('fas');
            }
        }, function(errorResponse) {
            $('#search-stock-information').addClass('d-none');
            normalSearchButton()
            $('#exampleModal').modal('show');
        }
    )
}

// Function to add stocks to watch list using the star button

$('#watch-list-star').click(function(){
    var company_name = $('.company-name').html();
    var company_symbol = $('#company-symbol').html();
    var companySymbolLowerCase = company_symbol.toLowerCase();
    var selectedStock = JSON.parse(JSON.stringify(new CurrentStock (company_symbol,company_name)));
    var stockInWatchList = isStockWatched(watchListArray,selectedStock,companySymbolLowerCase);
    if (stockInWatchList) {
        $('#text-before-star').html('Add to my ');
        $('#watch-list-star').removeClass('fas');
        var stockIndex = watchListArray.findIndex(obj => obj.symbol === company_symbol && obj.name === company_name)
        watchListArray.splice(stockIndex, 1);
        $('#watch-list-counter').html(watchListArray.length);
        localStorage.setItem('myWatchList', JSON.stringify(watchListArray));
    } else {
        $('#text-before-star').html('Remove from my ');
        $('#watch-list-star').addClass('fas');
        watchListArray.push(selectedStock);
        $('#watch-list-counter').html(watchListArray.length);
        localStorage.setItem('myWatchList', JSON.stringify(watchListArray));
    }
});

// Functions called after the document is finished loading

$(document).ready(function() {
    $('#watch-list-counter').html(watchListArray.length);
    if (watchedStockSymbolToLookUp) {
        stockDataToDocument(watchedStockSymbolToLookUp);
        localStorage.removeItem("watchedStockToLookUp");
    }
});