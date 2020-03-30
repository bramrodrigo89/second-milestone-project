// define constants and variables 

// create table using data from watch list array

function watchListTableHTML() {
    var stockRows=[]
    var symbolArray=[]

    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = testAPI;
        var keyToken = testToken
    } else {
        var baseURL = realAPI;
        var keyToken = realToken}

    if (watchListArray && watchListArray.length) {
        
        watchListArray.forEach(function(item) {
            var symbol = item.symbol
            symbolArray.push(symbol)
        });
        var URLSymbolArray = symbolArray.join(',').toLowerCase()
        $.when(
            $.getJSON(`${baseURL}stable/stock/market/batch?symbols=${URLSymbolArray}&types=quote&${keyToken}`),
        ).then(
            function(response) {
                var el = document.getElementById('my-watch-list-table')
                var tableData =  response
                var priceChangesArray = []
                var percentChangesArray = []
                for (let elem in tableData) {
                    var stockRow=[]
                    var stockObject = tableData[elem]
                    var companySymbolWatchList = stockObject.quote.symbol
                    var companyNameWatchList = stockObject.quote.companyName
                    var latestPriceWatchList = stockObject.quote.latestPrice
                    var changeWatchList = stockObject.quote.change
                    var changePercentWatchList = stockObject.quote.changePercent*100
                    var textColor=''
                    var signPlusMinus = ''
                    if (changeWatchList<0) {
                        var textColor='bg-danger text-white'
                        var signPlusMinus=''
                    } else {
                        var textColor='bg-success text-white'
                        var signPlusMinus='+'
                    }
                    priceChangesArray.push(changeWatchList);
                    percentChangesArray.push(changePercentWatchList)
                    stockRow.push(`<th><strong>(${companySymbolWatchList})</strong> ${companyNameWatchList}</th><td class='text-center'>${latestPriceWatchList}</td><td class="text-center"><span class='${textColor}'>${signPlusMinus} ${changeWatchList} US$</span></td><td class="text-center"><span class='${textColor}'>${changePercentWatchList.toFixed(2)}%</span></td>`);
                    stockRows.push(`<tr class='clickable-row' data-href='index.html'>${stockRow}</tr>`);
                }
                var rowsHTML = Object.values(stockRows).join(' ');

                el.innerHTML = `<table class="table table-dark table-hover my-4">
                                    <thead><tr><th>Name</th><th class="text-center">Latest Price</th><th class="text-center">Change</th><th class="text-center">Change Percent</th></tr></thead>
                                    <tbody>${rowsHTML}</tbody>
                                </table>`
                // Calculate average of price changes from WatchList
                var totalPriceChanges = 0;
                var totalPercentChanges = 0;
                for(var i = 0; i < priceChangesArray.length; i++) {
                    totalPriceChanges += priceChangesArray[i];
                    totalPercentChanges+= percentChangesArray[i];
                }
                var averagePriceChange = totalPriceChanges / priceChangesArray.length;
                var averagePercentChange = totalPercentChanges / percentChangesArray.length;
                if (averagePriceChange > 0) {
                    $('.badge-my-watch-list').addClass('badge-success')
                } else {
                    $('.badge-my-watch-list').addClass('badge-danger')
                }
                $('#my-price-changes-average').html(averagePriceChange.toFixed(2))
                console.log(averagePercentChange)
                $('#my-change-percent-average').html(averagePercentChange.toFixed(2))
                
               
                $('.clickable-row').click(function() {
                    stockDataToDocument('aapl');
                    window.location = $(this).data("href");
                });   
            }, function(errorResponse) {console.log('Error loading data')}
        );
    } else {
        return ``
    }
}

// Functions called after the document is finished loading

$(document).ready(function() {
    $('#watch-list-counter').html(watchListArray.length);
    $('#my-watch-list-table').html(watchListTableHTML());
});