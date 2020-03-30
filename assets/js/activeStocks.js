function createStockCards(data) {

    var activeStockCards = data.map(function (item) {
        var activeStockSymbol = item.symbol
        var activeStockName = item.companyName
        var activeExchange = item.primaryExchange
        var activeLatestPrice = item.latestPrice
        var activeChangePrice = item.change.toFixed(2)
        var activeChangePercent = item.changePercent.toFixed(2)
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
                        <h5 class="card-title">(${activeStockSymbol}) ${activeStockName}</h5>
                        <p class="card-text">Latest Price: <strong>${activeLatestPrice} US$</strong></p>
                        <a href="#active-stock-information" onclick="stockDataToDocument('${activeStockSymbol}')" class="badge ${classActiveStock}">${activeChangePrice} US$ (${activeChangePercent}%)</a>
                    </div>
                    <div class="card-footer text-muted">
                        2 days ago
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

    $.when(
        $.getJSON(`${baseURL}stable/stock/market/collection/list?collectionName=mostactive&${keyToken}`),

    ).then(
        function(response) {
            var activeStocksList = response
            console.log(activeStocksList)
            $('#active-stocks-list').html(createStockCards(activeStocksList))
        }, function(errorResponse) {
            console.log('Error loading data')
        }
    )
    
    $('.active-stock-card').click(function(){
        
        stockDataToDocument()
    });
}

activestocksToDocument();