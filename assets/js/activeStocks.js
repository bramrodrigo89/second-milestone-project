focusScrollMethod = function getFocus() {
    document.getElementById("testAPISwitch").focus({preventScroll:false});
}

function createStockCards(data) {

    var activeStockCards = data.map(function (item) {
        var activeStockSymbol = item.symbol
        var activeStockName = item.companyName
        var activeExchange = item.primaryExchange
        var activeLatestPrice = item.latestPrice
        var activeChangePrice = item.change.toFixed(2)
        var activeChangePercent = item.changePercent.toFixed(2)
        var lastUpdateTime = new Date(item.latestUpdate).toLocaleString("en-US").toString();
        if (activeChangePrice > 0) {
            var classActiveStock = 'badge-success'
        } else if (activeChangePrice < 0) {
            var classActiveStock = 'badge-danger'
        } else { var classActiveStock = 'badge-secondary'}
            return `<div class="active-stock-card card text-white bg-dark mb-3">
                        <div class="card-header">
                            ${activeExchange}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"> ${activeStockName} (<span class='card-symbol'>${activeStockSymbol}</span>)</h5>
                            <a href="#active-stock-information" class="badge ${classActiveStock}">${activeChangePrice} US$ (${activeChangePercent}%)</a>
                            <p class="card-text">Last Price: <strong>${activeLatestPrice} US$</strong></p>
                        </div>
                        <div class="card-footer text-muted">
                            Updated: ${lastUpdateTime}
                        </div>
                    </div>`
    });

    return activeStockCards.join('\n')

}

function etfsListTableHTML() {
    var etfsRows=[]
    var etfsListArray=['spy','dia','iwm','qqq']
    var URLSymbolArray = etfsListArray.join(',')

    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = testAPI;
        var keyToken = testToken
    } else {
        var baseURL = realAPI;
        var keyToken = realToken}
    
    $.when(
        $.getJSON(`${baseURL}stable/stock/market/batch?symbols=${URLSymbolArray}&types=quote&${keyToken}`),
    ).then(
        function(response) {
            var el = document.getElementById('popular-etfs-list')
            var tableData =  response
            
            for (let elem in tableData) {
                var etfRow=[]
                var etfObject = tableData[elem]
                var etfSymbol = etfObject.quote.symbol
                var etfName = etfObject.quote.companyName
                var latestPriceEtf = etfObject.quote.latestPrice
                var changeEtf = etfObject.quote.change
                var changePercentEtf = etfObject.quote.changePercent*100
                var textColor=''
                var signPlusMinus = ''
                if (changeEtf<0) {
                    var textColor='bg-danger text-white'
                    var signPlusMinus=''
                } else {
                    var textColor='bg-success text-white'
                    var signPlusMinus='+'
                }
                etfRow.push(`<th>${etfName} (<span class='etf-symbol'>${etfSymbol}</span>)</th><td class='text-center'>${latestPriceEtf}</td><td class="text-center"><span class='${textColor}'>${signPlusMinus} ${changeEtf} US$</span> <span class='${textColor}'>(${changePercentEtf.toFixed(2)}%)</span></td>`);
                etfsRows.push(`<tr class='clickable-row' data-href='index.html'>${etfRow}</tr>`);
                } 
                var rowsHTML = Object.values(etfsRows).join(' ');

                el.innerHTML = `<table class="table table-dark table-hover my-4">
                                    <thead><tr><th>Name</th><th class="text-center">Latest Price</th><th class="text-center">Change</th></tr></thead>
                                    <tbody>${rowsHTML}</tbody>
                                </table>`
                
                $('.clickable-row').click(function() {
                    focusScrollMethod();
                    var etfSymbolToLookUp = $(this).find('.etf-symbol').html()
                    setTimeout(stockDataToDocument,1000, etfSymbolToLookUp);
                });   
            }, function(errorResponse) {console.log('Error loading data')}
        );

}

function activestocksToDocument() {
    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = testAPI;
        var keyToken = testToken
    } else {
        var baseURL = realAPI;
        var keyToken = realToken}
    isSwitchChecked();

    $('.loading-symbol-market-briefing').html(`
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-info m-5" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`);

    $.when(
        $.getJSON(`${baseURL}stable/stock/market/collection/list?collectionName=mostactive&${keyToken}`),

    ).then(
        function(response) {
            var activeStocksList = response
            $('.loading-symbol-market-briefing').html(``)
            $('#active-stocks-list').html(createStockCards(activeStocksList))
            $('.active-stock-card').click(function(){
                var symbolToLookUp = $(this).find('.card-symbol').html()
                focusScrollMethod();
                setTimeout(stockDataToDocument, 900, symbolToLookUp);
            });
        }, function(errorResponse) {
            console.log('Error loading data')
        }
    )
}

$(document).ready(function() {
    activestocksToDocument();
    etfsListTableHTML()
});


