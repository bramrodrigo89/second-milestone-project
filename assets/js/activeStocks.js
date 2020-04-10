// Create Cards for the currently most active stocks in the market 

function createStockCards(data) {
    var activeStockCards = data.map(function (item) {
    var activeStockSymbol = item.symbol;
    var activeStockName = item.companyName;
    var activeExchange = item.primaryExchange;
    var activeLatestPrice = item.latestPrice;
    var activeChangePrice = (item.change==null)? 0.00 : item.change;
    var activeChangePercent = item.changePercent*100;
    var lastUpdateTime = new Date(item.latestUpdate).toLocaleTimeString("en-US").toString();
    var classActiveStock = (activeChangePrice > 0)? 'badge-success': (activeChangePrice < 0)? 'badge-danger' : 'badge-secondary';
    
    return `<div class="active-stock-card card text-white bg-dark mb-3">
                        <div class="card-header">
                            ${activeExchange}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"> ${activeStockName} (<span class='card-symbol'>${activeStockSymbol}</span>)</h5>
                            <a href="#active-stock-information" class="badge ${classActiveStock}">${activeChangePrice.toFixed(2)} US$ (${activeChangePercent.toFixed(2)}%)</a>
                            <p class="mt-2 card-text">Last Price: <strong>${activeLatestPrice} US$</strong></p>
                        </div>
                        <div class="card-footer text-muted">
                            Updated: ${lastUpdateTime}
                        </div>
                    </div>`;
    });
    return activeStockCards.join('\n');
}

// creates table with current quotes from popular ETFs

function etfsListTableHTML() {
    var etfsListArray=['spy','dia','iwm','qqq'];
    var URLSymbolArray = etfsListArray.join(',');
    var baseURL = ($('#testAPISwitch').is(':checked'))? testAPI : realAPI;
    var keyToken = ($('#testAPISwitch').is(':checked'))? testToken : realToken;
    $.when(
        $.getJSON(`${baseURL}stable/stock/market/batch?symbols=${URLSymbolArray}&types=quote&${keyToken}`)
    ).then(
        function(response) {
            var etfsRows=[];
            var el = document.getElementById('popular-etfs-list');
            var tableData =  response;
            var tableDataKeys = Object.keys(tableData);
            for (var i = 0; i<tableDataKeys.length; i++) {
                var etfRow=[];
                var etfObject = tableData[tableDataKeys[i]];
                var etfSymbol = etfObject.quote.symbol;
                var etfName = etfObject.quote.companyName;
                var latestPriceEtf = etfObject.quote.latestPrice;
                var changeEtf = etfObject.quote.change;
                var changePercentEtf = etfObject.quote.changePercent*100;
                var ytdChange = etfObject.quote.ytdChange*100;
                var badgeColor = (changeEtf<0.0)? 'badge-danger' : (changeEtf>0.001)? 'badge-success' : 'badge-secondary';
                var signPlusMinus = (changeEtf<0.0)? '' : (changeEtf>0.001)? '+' : '';
                etfRow.push(   `<th>${etfName} (<span class='etf-symbol'>${etfSymbol}</span>)</th>
                                <td class="">${latestPriceEtf.toFixed(2)} US$ <span class='badge ${badgeColor} mx-2'>${signPlusMinus} ${changeEtf.toFixed(2)} US$ (<span class='change-percent-etf'>${changePercentEtf.toFixed(2)}</span>%)</span></td>
                                <td class="">${ytdChange.toFixed(2)} %</td>`);
                etfsRows.push(`<tr class='clickable-row' data-href='index.html'>${etfRow}</tr>`);
                } 
                var rowsHTML = Object.values(etfsRows).join(' ');
                el.innerHTML = `<table class="table table-dark table-hover my-4">
                                    <thead><tr><th>Name</th><th class="">Latest Price</th><th class="">YTD Change</th></tr></thead>
                                    <tbody>${rowsHTML}</tbody>
                                </table>`;
                $('.clickable-row').click(function() {
                    focusScrollMethod();
                    var etfSymbolToLookUp = $(this).find('.etf-symbol').html();
                    setTimeout(stockDataToDocument,1000, etfSymbolToLookUp);
                });   
            }, function(errorResponse) {console.log('Error loading data');}
        );
}

// combines previous functions to call when data is loaded

function activestocksToDocument() {
    var baseURL = ($('#testAPISwitch').is(':checked'))? testAPI : realAPI;
    var keyToken = ($('#testAPISwitch').is(':checked'))? testToken : realToken;
    $('.loading-symbol-market-briefing').html(`
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-info m-5" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`);
    $.when(
        $.getJSON(`${baseURL}stable/stock/market/collection/list?collectionName=mostactive&${keyToken}`)
    ).then(
        function(response) {
            var activeStocksList = response;
            $('.loading-symbol-market-briefing').html('');
            $('#active-stocks-list').html(createStockCards(activeStocksList));
            $('.active-stock-card').click(function(){
                var symbolToLookUp = $(this).find('.card-symbol').html();
                focusScrollMethod();
                setTimeout(stockDataToDocument, 900, symbolToLookUp);
            });
        }, function(errorResponse) {
            console.log('Error loading data');
        }
    );
}

// Focus screen on top position of page index.html

focusScrollMethod = function getFocus() {
    document.getElementById("testAPISwitch").focus({preventScroll:false});
};

// When API Switch is clicked, all numbers displayed are refreshed

$("#testAPISwitch").click(function(){
    if ($('#search-stock-information').hasClass('d-none')) {
        activestocksToDocument();
        etfsListTableHTML();
    } else {
        var symbolToLookUp = $('#company-symbol').html();
        stockDataToDocument(symbolToLookUp);
        activestocksToDocument();
        etfsListTableHTML();
    }
});

// Functions to call when page is complete 

$(document).ready(function() {
    activestocksToDocument();
    etfsListTableHTML();
    $("#testAPISwitchContainer").hover(function () {
        $('[data-toggle="tooltip"]').tooltip('show');
    }, function(){
        $('[data-toggle="tooltip"]').tooltip('hide')
    }); 
});



