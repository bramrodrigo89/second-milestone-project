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
                var tableData = response
                
                for (let elem in tableData) {
                    var stockObject = tableData[elem]
                    var companyName = stockObject.quote.companyName
                    var latestPrice = stockObject.quote.latestPrice
                    var stockRow=[]

                    stockRow.push(`<th>${companyName}</th><td>${latestPrice}</td><td>Value 2</td>`);
                    stockRows.push(`<tr>${stockRow}</tr>`);
                    
                }

            }, function(errorResponse) {console.log('Error loading data')}
        );
        
        var rowsHTML = Object.keys(stockRows)
        console.log(stockRows)
        console.log(rowsHTML)
        return  `<table class="table table-striped table-dark my-4">
            <thead>
                <tr><th>Name</th><th>Latest Price</th><th>Change</th></tr>
            </thead>
            <tbody>
                ${stockRows}
            </tbody>
            </table>`
        
    } else {
        return `<p>Currently nothing in your Watch List!</p>`
    }
   
    
}

// Functions called after the document is finished loading

$(document).ready(function() {
    $('#watch-list-counter').html(watchListArray.length);
    $('#my-watch-list-table').html(watchListTableHTML());
});
