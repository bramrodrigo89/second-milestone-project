// define constants and variables 

var cachedWatchList = JSON.parse(localStorage.getItem("myWatchList"))
if (cachedWatchList == null) {
    var watchListArray=[];
} else {
    var watchListArray = cachedWatchList;
}

// create table using data from watch list array

function watchListTableHTML() {
    var stockRows=[]
    var symbolArray=[]
    version = 'stable/stock/'

    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = 'https://sandbox.iexapis.com/'
        var keyToken = 'token=Tpk_2cb28d1e81034940b4058a5d063b25a5'
    } else {
        var baseURL = 'https://cloud.iexapis.com/'
        var keyToken = 'token=pk_45af954261be4449955cbefadc328b65'}

    if (watchListArray && watchListArray.length) {
        
        watchListArray.forEach(function(item) {
            var symbol = item.symbol
            symbolArray.push(symbol)
        });
        var URLSymbolArray = symbolArray.join(',').toLowerCase()

        $.when(
            $.getJSON(`${baseURL}${version}market/batch?symbols=${URLSymbolArray}&types=quote&${keyToken}`),
        ).then(
            function(response) {
                var el = document.getElementById('my-watch-list-table')
                var tableData =  response
                for (let elem in tableData) {
                    var stockRow=[]
                    var stockObject = tableData[elem]
                    var companyNameWatchList = stockObject.quote.companyName
                    var latestPriceWatchList = stockObject.quote.latestPrice
                    var changeWatchList = stockObject.quote.change
                    var changePercentWatchList = stockObject.quote.changePercent
                    stockRow.push(`<th>${companyNameWatchList}</th><td>${latestPriceWatchList}</td><td>${changeWatchList}</td><td>${changePercentWatchList}</td>`);
                    stockRows.push(`<tr>${stockRow}</tr>`);
                }
                var rowsHTML = Object.values(stockRows).join(' ');

                el.innerHTML = `<table class="table table-striped table-dark my-4">
                                    <thead><tr><th>Name</th><th>Latest Price</th><th>Change</th><th>Change Percent</th></tr></thead>
                                    <tbody>${rowsHTML}</tbody>
                                </table>`
            
            }, function(errorResponse) {console.log('Error loading data')}
        );
    } else {
        return `<p>Currently nothing in your Watch List!</p>`
    }   
}

// Functions called after the document is finished loading

$(document).ready(function() {
    $('#watch-list-counter').html(watchListArray.length);
    $('#my-watch-list-table').html(watchListTableHTML());
});
