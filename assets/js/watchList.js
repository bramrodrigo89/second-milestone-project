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
    var tableHeaders = '<tr><th>Name</th><th>Price</th><th>Change</th></tr>'

    if (watchListArray && watchListArray.length) {
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
    } else {
        return `<p>Currently nothing in your Watch List!</p>`
    }
   
    
}

// Functions called after the document is finished loading

$(document).ready(function() {
    $('#watch-list-counter').html(watchListArray.length);
    $('#my-watch-list-table').html(watchListTableHTML());
});
