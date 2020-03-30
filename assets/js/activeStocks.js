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
            return `<div class="card text-white bg-dark mb-3 active-stock-card">
                        <div class="card-header">
                            ${activeExchange}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"><span class='card-symbol'>${activeStockSymbol}</span></h5>
                            <p class='card-text'>${activeStockName}</p>
                            <a href="#active-stock-information" onclick="stockDataToDocument('${activeStockSymbol}')" class="badge ${classActiveStock}">${activeChangePrice} US$ (${activeChangePercent}%)</a>
                            <p class="card-text">Last Price: <strong>${activeLatestPrice} US$</strong></p>
                        </div>
                        <div class="card-footer text-muted">
                            Updated: ${lastUpdateTime}
                        </div>
                    </div>`
    });

    return activeStockCards.join('\n')
}

function activestocksToDocument() {
    if ($('#testAPISwitch').is(':checked')) {
        var baseURL = testAPI;
        var keyToken = testToken
    } else {
        var baseURL = realAPI;
        var keyToken = realToken}
    isSwitchChecked();

    $('#loading-symbol-active-stocks').html(`
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
            $('#loading-symbol-active-stocks').html(``)
            $('#active-stocks-list').html(createStockCards(activeStocksList))
            console.log(activeStocksList)
        }, function(errorResponse) {
            console.log('Error loading data')
        }
    )
}

$(document).ready(function() {
    activestocksToDocument();
    $('.active-stock-card').click(function(){
        var symbolToLookUp = $(this).find('.card-symbol').html()
        console.log('huh?')
        console.log(symbolToLookUp);
    });
});


