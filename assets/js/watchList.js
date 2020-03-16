var watchListArray = []

$('#watch-list-star').click(function(){
    $(this).toggleClass('fas');
    var company_name = $('.company-name').html();
    var company_symbol = $('#company-symbol').html();
    var selectedStock = {symbol: company_symbol, name: company_name};

    watchListArray.push(selectedStock);
    console.log(watchListArray);
});