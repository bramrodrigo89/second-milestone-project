function createStockCards(data) {

    var activeStockCards = data.map(function (item) {
    return `<div class="card text-center">
                <div class="card-header">
                    Featured
                </div>
                <div class="card-body">
                    <h5 class="card-title">Special title treatment</h5>
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
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
        $.getJSON(`${baseURL}${version}market/collection/list?collectionName=mostactive&${keyToken}`),

    ).then(
        function(response) {
            var activeStocksList = response
            console.log(activeStocksList)
            $('#active-stocks-list').html(activeStocksList)
        }, function(errorResponse) {
            console.log('Error loading data')
        }
    )
    
}