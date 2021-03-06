
// The following code for creating an autocomplete menu list was based on the lesson "How To Autocomplete" Lesson from W3Schools
// Code was adapted to this project's needs, though the functions share considerable similarity
// Lesson can be found under https://www.w3schools.com/howto/howto_js_autocomplete.asp

function addActive(x, focus) {
    if (!x) return false;
    removeActive(x);
    if (focus >= x.length) focus = 0;
    if (focus < 0) focus = (x.length - 1);
    x[focus].classList.add("autocomplete-active");
}

function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}

function closeAllLists(elmnt) {
    var inp = $("#symbolInputText").val();
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

function searchStockInformation(event) {
    var fragment = $("#symbolInputText").val();
    if (fragment) {
        var currentFocus;
        var baseURL = ($('#testAPISwitch').is(':checked'))? testAPI : realAPI;
        var keyToken = ($('#testAPISwitch').is(':checked'))? testToken : realToken;
        
        $.when(
            $.getJSON(`${baseURL}stable/search/${fragment}?${keyToken}`)
        ).then(
            function (response) {
                var suggestedStocksArray = response;
                var a, b, i, val = $("#symbolInputText").val();
                closeAllLists();
                if (!val) { return false;}
                currentFocus = -1;
                a = document.createElement("DIV");
                a.setAttribute("id", document.getElementById('symbolInputText').id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                document.getElementById('symbolInputText').parentNode.appendChild(a);
                for (i = 0; i < 5; i++) {
                    var suggestedSymbol = suggestedStocksArray[i].symbol.toString();
                    var suggestedName = suggestedStocksArray[i].securityName.toString();
                    b = document.createElement("DIV");
                    b.innerHTML = "<span class='text-bold'>" + suggestedSymbol.substr(0, val.length) + "</span>";
                    b.innerHTML += suggestedSymbol.substr(val.length)+" - "+suggestedName;
                    b.innerHTML += "<input type='hidden' value='"+suggestedSymbol+"'>";
                    b.addEventListener("click", function(e) {
                        $("#symbolInputText").val(this.getElementsByTagName("input")[0].value);
                        stockDataToDocument(this.getElementsByTagName("input")[0].value);
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        );
        document.getElementById('symbolInputText').addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x, currentFocus);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x, currentFocus);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });

        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
}


