// create table using data from watch list array

function calculateAverages(arr1, arr2, arr3, arr4, arr5, totalUnits) {
    // Calculate average of price changes from WatchList
    var totalPriceChanges = 0;
    var totalPercentChanges = 0;
    var totalDailyGain = 0;
    var totalChangeGain = 0;
    var totalPercentageGain = 0;
    // calculation of daily average and total gain
    for (var i = 0; i < arr1.length; i++) {
        totalPriceChanges += arr1[i];
        totalPercentChanges += arr2[i];
        totalDailyGain += arr3[i];
        totalChangeGain += arr4[i];
        totalPercentageGain += arr5[i];
    }
    var averagePriceChange = totalPriceChanges / totalUnits;
    var averagePercentChange = totalPercentChanges / totalUnits;
    var averageChangeGain = totalChangeGain;
    var averagePercentageGain = (totalChangeGain*100)/(totalDailyGain - totalChangeGain);
    // Set text and badge colors depending on calcultion results
    if (averageChangeGain > 0) {
        $('.badge-my-watch-list-average').addClass('badge-success');
        $('.badge-my-watch-list-average').removeClass('badge-danger');
        $('#my-daily-gain-or-loss').addClass('text-success');
        $('#my-daily-gain-or-loss').removeClass('text-danger');
        $('.plus-or-minus-gain').html('+');
    } else if (averageChangeGain < 0) {
        $('.badge-my-watch-list-average').addClass('badge-danger');
        $('.badge-my-watch-list-average').removeClass('badge-success');
        $('#my-daily-gain-or-loss').addClass('text-danger');
        $('#my-daily-gain-or-loss').removeClass('text-success');
        $('.plus-or-minus-gain').html('');
    } else {
        $('.badge-my-watch-list-average').addClass('badge-secondary');
        $('.badge-my-watch-list-average').removeClass('badge-danger badge-success');
        $('#my-daily-gain-or-loss').addClass('text-secondary');
        $('#my-daily-gain-or-loss').removeClass('text-danger text-success');
        var averagePercentageGain = 0.00;
        var averagePriceChange = 0.00;
        var averagePercentChange = 0.00;
        $('.plus-or-minus-gain').html('');
    }
    // Set calculated values into the page
    $('#my-price-changes-average').html(averagePriceChange.toFixed(2));
    $('#my-change-percent-average').html(averagePercentChange.toFixed(2));
    $('#my-shares-total').html(totalDailyGain.toFixed(2));
    $('#my-daily-gain-change').html(averageChangeGain.toFixed(2));
    $('#my-daily-gain-percent').html(averagePercentageGain.toFixed(2));
}

function watchListTableHTML() {
    var stockRows = [];
    var symbolArray = [];
    var baseURL = ($('#testAPISwitch').is(':checked'))? testAPI : realAPI;
    var keyToken = ($('#testAPISwitch').is(':checked'))? testToken : realToken;
    if (watchListArray && watchListArray.length) {
        watchListArray.forEach(function (item) {
            var symbol = item.symbol;
            symbolArray.push(symbol);
        });
        var URLSymbolArray = symbolArray.join(',').toLowerCase();
        $.when(
            $.getJSON(`${baseURL}stable/stock/market/batch?symbols=${URLSymbolArray}&types=quote&${keyToken}`)
        ).then(
            function (response) {
                var tableData = response;
                var tableDataKeys = Object.keys(tableData);
                var priceChangesArray = [];
                var percentChangesArray = [];
                var gainChangesArray = [];
                var percentGainChangesArray = [];
                var totalGainsArray = [];
                var totalShares = 0;
                for (var i = 0; i<tableDataKeys.length; i++) {
                    var stockRow = [];
                    var stockObject = tableData[tableDataKeys[i]];
                    var companySymbolWatchList = stockObject.quote.symbol;
                    var companyNameWatchList = stockObject.quote.companyName;
                    var latestPriceWatchList = stockObject.quote.latestPrice;
                    var changeWatchList = stockObject.quote.change;
                    var changePercentWatchList = stockObject.quote.changePercent*100;
                    var numberShares = watchListArray[i].units;
                    var totalAmountShares = latestPriceWatchList*numberShares;
                    var totalChangeShares = changeWatchList*numberShares;
                    var badgeColor = (changeWatchList < 0)? 'badge-danger' : (changeWatchList > 0)? 'badge-success' : 'badge-secondary';
                    var signPlusMinus = (changeWatchList < 0)? '' : (changeWatchList > 0)? '+' : '';
                    priceChangesArray.push(changeWatchList * numberShares);
                    percentChangesArray.push(changePercentWatchList * numberShares);
                    totalGainsArray.push(latestPriceWatchList * numberShares);
                    gainChangesArray.push(changeWatchList * numberShares);
                    percentGainChangesArray.push(changePercentWatchList * numberShares);
                    totalShares+=numberShares;
                    stockRow.push( `<th><i class="far fas fa-star mx-2 text-warning text-large star-watch-list"></i></th>
                                    <td class='clickable-row' data-href='index.html'>(<span class='watched-stock-symbol-table'>${companySymbolWatchList}</span>) <span class='watched-stock-name-table'>${companyNameWatchList}</span></td>
                                    <td>${numberShares}<div style="min-width:80px"> <i class="fas fa-plus-circle mx-1 text-large text-info"></i> <i class="fas fa-minus-circle mx-1 text-large text-info"></i></div></td>
                                    <td class='text-center'>${latestPriceWatchList.toFixed(2)} US$ <span class='badge mx-2 ${badgeColor}'> ${signPlusMinus} ${changeWatchList.toFixed(2)} US$ (${changePercentWatchList.toFixed(2)}%)</span></td>
                                    <td class="text-center">${totalAmountShares.toFixed(2)} US$ <span class='badge mx-2 ${badgeColor}'> ${signPlusMinus} ${totalChangeShares.toFixed(2)} US$</span></td>`);
                    stockRows.push(`<tr class="table-stock-row">${stockRow}</tr>`);
                }
                var rowsHTML = Object.values(stockRows).join(' ');
                $('#my-watch-list-table').html(`<table class="table table-responsive table-dark table-hover my-4">
                                                    <thead><tr><th></th><th>Name</th><th>Shares</th><th class="text-center">Price</th><th class="text-center">Total</th></tr></thead>
                                                    <tbody>${rowsHTML}</tbody>
                                                </table>`);
                calculateAverages(priceChangesArray, percentChangesArray, totalGainsArray, gainChangesArray, percentGainChangesArray,totalShares);
            }, function (errorResponse) { console.log('Error loading data') }
        );
    } else {
        return `<p>Your Watch List is currently empty. Start adding some stocks or ETFs from the Stock Quote page</p>`;
    }
}

// function to remove stock from watchListArray using the star icon

$(document).on('click', '.star-watch-list', function () {
    if ($(this).hasClass('fas')) {
        $(this).removeClass('fas');
        var rowLocation = $(this).closest('.table-stock-row');
        var companySelected = rowLocation.find('.watched-stock-symbol-table').html();
        var stockIndexInArray = watchListArray.findIndex(obj => obj.symbol === companySelected);
        watchListArray.splice(stockIndexInArray, 1);
        $('#watch-list-counter').html(watchListArray.length);
        localStorage.setItem('myWatchList', JSON.stringify(watchListArray));
    } else {
        $(this).addClass('fas');
        var rowLocation = $(this).closest('.table-stock-row');
        var companySelected = rowLocation.find('.watched-stock-symbol-table').html();
        var companyNameSelected = rowLocation.find('.watched-stock-name-table').html();
        var selectedStock = JSON.parse(JSON.stringify(new CurrentStock(companySelected, companyNameSelected, 1)));
        watchListArray.push(selectedStock);
        $('#watch-list-counter').html(watchListArray.length);
        localStorage.setItem('myWatchList', JSON.stringify(watchListArray));
    }
});

// function to set a local stored variable when one of the rows is clicked to be searched on index.html

$(document).on('click', '.clickable-row', function () {
    var watchedStockToLookUp = $(this).find('.watched-stock-symbol-table').html();
    window.location = $(this).data("href");
    localStorage.setItem('watchedStockToLookUp', JSON.stringify(watchedStockToLookUp));
});

// Function to add or remove share units on the WatchList Table

$(document).on('click', '.fa-plus-circle', function () {
    var rowLocation = $(this).closest('.table-stock-row');
    var companySelected = rowLocation.find('.watched-stock-symbol-table').html();
    var stockIndexInArray = watchListArray.findIndex(obj => obj.symbol === companySelected);
    watchListArray[stockIndexInArray].units++;
    localStorage.setItem('myWatchList', JSON.stringify(watchListArray));
    $('#my-watch-list-table').html(watchListTableHTML());
});

$(document).on('click', '.fa-minus-circle', function () {
    var rowLocation = $(this).closest('.table-stock-row');
    var companySelected = rowLocation.find('.watched-stock-symbol-table').html();
    var stockIndexInArray = watchListArray.findIndex(obj => obj.symbol === companySelected);
    if(watchListArray[stockIndexInArray].units>0) {
        watchListArray[stockIndexInArray].units--;
        localStorage.setItem('myWatchList', JSON.stringify(watchListArray));
        $('#my-watch-list-table').html(watchListTableHTML());
    } else if (watchListArray[stockIndexInArray].units==0) {
        localStorage.setItem('myWatchList', JSON.stringify(watchListArray));
        $('#my-watch-list-table').html(watchListTableHTML());
    }
});

// When API Switch is clicked, all numbers displayed are refreshed

$("#testAPISwitch").click(function(){
    $('#my-watch-list-table').html(watchListTableHTML());
    $('#watch-list-counter').html(watchListArray.length);
});

// Functions called after the document is finished loading

$(document).ready(function () {
    $('#my-watch-list-table').html(watchListTableHTML());
    $('#watch-list-counter').html(watchListArray.length);
    $("#testAPISwitchContainer").hover(function () {
        $('[data-toggle="tooltip"]').tooltip('show');
    }, function(){
        $('[data-toggle="tooltip"]').tooltip('hide')
    }); 
});