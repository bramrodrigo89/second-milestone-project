



$('#watch-list-star').click(function(){
    var company_name = $('.company-name').html();
    var company_symbol = $('#company-symbol').html();
    var selectedStock = {symbol: company_symbol, name: company_name};
    var isStockWatched = watchListArray.some(selectedStock => selectedStock.symbol===company_symbol)

    if (isStockWatched) {
        console.log('It is already in the array!');
    } else {
        console.log('It is not in the array yet, the new array is:')
        watchListArray.push(selectedStock);
        console.log(watchListArray);
    }
});