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
                    var textColor=''
                    var signPlusMinus = ''
                    if (changeWatchList<0) {
                        var textColor='bg-danger text-white'
                        var signPlusMinus=''
                    } else {
                        var textColor='bg-success text-white'
                        var signPlusMinus='+'
                    }
                    stockRow.push(`<th>${companyNameWatchList}</th><td class='text-center'>${latestPriceWatchList}</td><td class="text-center"><span class='${textColor}'>${signPlusMinus} ${changeWatchList} US$</span></td><td class="text-center"><span class='${textColor}'>${changePercentWatchList}%</span></td>`);
                    stockRows.push(`<tr class='clickable-row' data-href='index.html'>${stockRow}</tr>`);
                }
                var rowsHTML = Object.values(stockRows).join(' ');

                el.innerHTML = `<table class="table table-dark table-hover my-4">
                                    <thead><tr><th>Name</th><th class="text-center">Latest Price</th><th class="text-center">Change</th><th class="text-center">Change Percent</th></tr></thead>
                                    <tbody>${rowsHTML}</tbody>
                                </table>`
                $('.clickable-row').click(function() {
                    window.location = $(this).data("href");
                    $('#symbolInputText').val('aapl');
                    stockDataToDocument();
                    $('#symbolInputText').val('');
                });   
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