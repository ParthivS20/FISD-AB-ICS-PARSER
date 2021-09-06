var done = false;
if (document.visibilityState === 'visible' && !done) {
    goToClass();
    done = true;
}
else {
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible'  && !done) {
            goToClass();
            done = true;
        }
    });
}

function goToClass() {
    window.focus();
    var url = "https://FISD-AB-ICS-PARSER.parthivs20.repl.co/";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (Math.floor(xhr.status / 100) == 2) {
                var json = JSON.parse(xhr.responseText);
                manualRedirect(json);
            }
            else {
                window.alert("Error - Cannot connect to server (" + xhr.status + ")");
            }
        }
    };

    xhr.send();

    function manualRedirect(json) {
        var periods = ['1A', '2A', '3A', '4A', '1B', '2B', '3B', '4B'];
        var input = '';

        while (input.length != 2 || !periods.includes(input.toUpperCase())) {
            input = window.prompt("What Class?");
            if (input == null) break;
        }

        if (input) {
            var x = input[0];
            var y = input[1].toUpperCase();

            openCanvas(json[y][x], json.openInNewTab);
        }
        else {
            if (window.history.length == 1) {
                window.close();
            }
            else {
                window.history.back();
            }
        }
    }

    function openCanvas(url, newtab) {
        if (newtab && window.history.length > 2) {
            window.open(url, "_blank");
            window.history.back();
        }
        else {
            window.location.href = url;
        }
    }
}