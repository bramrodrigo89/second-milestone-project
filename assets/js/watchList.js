// define constants and variables 
var watchListArray = JSON.parse(localStorage.getItem("myWatchList"))

// create table using data from watch list array

function watchListTableHTML() {
    
    var stockRows=[]
    var tableHeaders = '<tr><th>Name</th><th>Price</th><th>Change</th></tr>'
    
    watchListArray.forEach(function(item){
        var stockRow=[]
        var company = item.name
        stockRow.push(`<th>${company}</th><td>Value 1</td><td>Value 2</td>`);
        stockRows.push(`<tr>${stockRow}</tr>`);
    });
   
    return  `<table class="table table-striped table-dark">
            <thead>
                ${tableHeaders}
            </thead>
            <tbody>
                ${stockRows}
            </tbody>
            </table>`
}

// Functions called after the document is finished loading

$(document).ready(function() {
    $('#my-watch-list-table').html(watchListTableHTML());
});
