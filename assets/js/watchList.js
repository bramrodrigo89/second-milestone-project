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
                        var textColor='badge-danger'
                        var signPlusMinus=''
                    } else  if (changeWatchList>0){
                        var textColor='badge-success'
                        var signPlusMinus='+'
                    } else {
                        var textColor='badge-secondary'
                        var signPlusMinus=''
                    }
                    priceChangesArray.push(changeWatchList);
                    percentChangesArray.push(changePercentWatchList)
                    stockRow.push(`<th>(<span class='watched-stock-symbol-table'>${companySymbolWatchList}</span>) ${companyNameWatchList}</th><td class='text-center'>${latestPriceWatchList} US$ <span class='badge ${textColor}'> ${signPlusMinus} ${changeWatchList} US$ (${changePercentWatchList.toFixed(2)}%) </span></td><td class="text-center">Total here!</td><td class="text-center">More Info</td>`);
                    stockRows.push(`<tr class='clickable-row' data-href='index.html'>${stockRow}</tr>`);
                }
                var rowsHTML = Object.values(stockRows).join(' ');

                el.innerHTML = `<table class="table table-dark table-hover my-4">
                                    <thead><tr><th>Name</th><th class="text-center">Latest Price</th><th class="text-center">Title</th><th class="text-center">Title</th></tr></thead>
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
                } else if (averagePriceChange < 0) {
                    $('.badge-my-watch-list').addClass('badge-danger')
                } else {
                    $('.badge-my-watch-list').addClass('badge-secondary')
                }
                $('#my-price-changes-average').html(averagePriceChange.toFixed(2))
                $('#my-change-percent-average').html(averagePercentChange.toFixed(2))
                
               
                $('.clickable-row').click(function() {
                    var watchedStockToLookUp = $(this).find('.watched-stock-symbol-table').html()
                    window.location = $(this).data("href");
                    localStorage.setItem('watchedStockToLookUp', JSON.stringify(watchedStockToLookUp));
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