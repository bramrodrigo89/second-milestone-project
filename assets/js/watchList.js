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
                var gainChangesArray = []
                var percentGainChangesArray = []
                var totalGainsArray = []
                var j=0
                for (let elem in tableData) {
                    var stockRow=[]
                    var stockObject = tableData[elem]
                    var companySymbolWatchList = stockObject.quote.symbol
                    var companyNameWatchList = stockObject.quote.companyName
                    var latestPriceWatchList = stockObject.quote.latestPrice
                    var changeWatchList = stockObject.quote.change
                    var changePercentWatchList = stockObject.quote.changePercent*100
                    var badgeColor=''
                    var signPlusMinus = ''
                    var numberShares = watchListArray[j].units
                    var total
                    if (changeWatchList<0) {
                        var badgeColor='badge-danger'
                        var signPlusMinus=''
                    } else  if (changeWatchList>0){
                        var badgeColor='badge-success'
                        var signPlusMinus='+'
                    } else {
                        var badgeColor='badge-secondary'
                        var signPlusMinus='0.00'
                    }
                    
                    priceChangesArray.push(changeWatchList);
                    percentChangesArray.push(changePercentWatchList);
                    totalGainsArray.push(latestPriceWatchList*numberShares);
                    gainChangesArray.push(changeWatchList*numberShares);
                    percentGainChangesArray.push(changePercentWatchList*numberShares);

                    stockRow.push(`<th><i class="fas fa-star mx-2 text-warning text-large star-watch-list"></i></th><td>(<span class='watched-stock-symbol-table'>${companySymbolWatchList}</span>) ${companyNameWatchList}</td><td class='text-center'>${numberShares}</td><td class='text-center'>${latestPriceWatchList} US$ <span class='badge mx-2 ${badgeColor}'> ${signPlusMinus} ${changeWatchList} US$<br>(${changePercentWatchList.toFixed(2)}%)</span></td><td class="text-center">Total here!</td>`);
                    stockRows.push(`<tr class='clickable-row' data-href='index.html'>${stockRow}</tr>`);
                    j++
                }
                var rowsHTML = Object.values(stockRows).join(' ');

                el.innerHTML = `<table class="table table-dark table-hover my-4">
                                    <thead><tr><th></th><th>Name</th><th>Shares</th><th class="text-center">Price</th><th class="text-center">Total</th></tr></thead>
                                    <tbody>${rowsHTML}</tbody>
                                </table>`
                // Calculate average of price changes from WatchList
                var totalPriceChanges = 0;
                var totalPercentChanges = 0;
                var totalDailyGain = 0;
                var totalChangeGain = 0;
                var totalPercentageGain = 0;

                // calculation of daily average and total gain
                for(var i = 0; i < priceChangesArray.length; i++) {
                    totalPriceChanges += priceChangesArray[i];
                    totalPercentChanges += percentChangesArray[i];
                    totalDailyGain += totalGainsArray[i];
                    totalChangeGain += gainChangesArray[i];
                    totalPercentageGain += percentGainChangesArray[i];
                }
                var averagePriceChange = totalPriceChanges / priceChangesArray.length;
                var averagePercentChange = totalPercentChanges / percentChangesArray.length;
                var averageChangeGain = totalChangeGain / gainChangesArray.length;
                var averagePercentageGain = totalPercentageGain / percentGainChangesArray.length;

                if (averagePriceChange > 0) {
                    $('.badge-my-watch-list-average').addClass('badge-success')
                    $('.my-daily-gain-or-loss').addClass('text-success')
                } else if (averagePriceChange < 0) {
                    $('.badge-my-watch-list-average').addClass('badge-danger')
                    $('.my-daily-gain-or-loss').addClass('text-danger')
                } else {
                    $('.badge-my-watch-list-average').addClass('badge-secondary')
                    $('.my-daily-gain-or-loss').addClass('text-secondary')
                }

                // Set calculated values into the page
                $('#my-price-changes-average').html(averagePriceChange.toFixed(2))
                $('#my-change-percent-average').html(averagePercentChange.toFixed(2))
                $('#my-shares-total').html(totalDailyGain.toFixed(2));
                $('#my-daily-gain-change').html(averageChangeGain.toFixed(2));
                $('#my-daily-gain-percent').html(averagePercentageGain.toFixed(2));

                // function to set a local stored variable when one of the rows is clicked to be searched on index.html
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