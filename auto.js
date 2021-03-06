var done = false;
if (document.visibilityState === 'visible' && !done) {
    goToClass();
    done = true;
}
else {
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible' && !done) {
            goToClass();
            done = true;
        }
    });
}

function goToClass() {
    var url = "https://FISD-AB-ICS-PARSER.parthivs20.repl.co/";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (Math.floor(xhr.status / 100) == 2) {
                var json = JSON.parse(xhr.responseText);
                autoRedirect(json);
            }
            else {
                window.alert("Error - Cannot connect to server (" + xhr.status + ")");
            }
        }
    };

    xhr.send();

    function autoRedirect(json) {
        today = new Date();
        today = new Date(today.toLocaleString('en-us', { timezone: "America/Chicago" }));
        
        var currentMin = today.getHours() * 60 + today.getMinutes();

        if (json.day.day == "A") {
            if (currentMin >= (9 * 60 + 0) && currentMin <= (10 * 60 + 30)) {
                openCanvas(json["A"]["1"], json.openInNewTab);
            }
            else if (currentMin >= (10 * 60 + 35) && currentMin <= (12 * 60 + 10)) {
                openCanvas(json["A"]["2"], json.openInNewTab);
            }
            else if (currentMin >= (13 * 60 + 0) && currentMin <= (14 * 60 + 30)) {
                openCanvas(json["A"]["3"], json.openInNewTab);
            }
            else if (currentMin >= (15 * 60 + 5) && currentMin <= (16 * 60 + 35)) {
                openCanvas(json["A"]["4"], json.openInNewTab);
            }
            else {
                manualRedirect(json);
            }
        }
        else if (json.day.day == "B") {
            if (currentMin >= (9 * 60 + 0) && currentMin <= (10 * 60 + 30)) {
                openCanvas(json["B"]["1"], json.openInNewTab);
            }
            else if (currentMin >= (10 * 60 + 35) && currentMin <= (12 * 60 + 10)) {
                openCanvas(json["B"]["2"], json.openInNewTab);
            }
            else if (currentMin >= (12 * 60 + 50) && currentMin <= (14 * 60 + 50)) {
                openCanvas(json["B"]["3"], json.openInNewTab);
            }
            else if (currentMin >= (14 * 60 + 55) && currentMin <= (16 * 60 + 25)) {
                openCanvas(json["B"]["4"], json.openInNewTab);
            }
            else {
                manualRedirect(json);
            }
        }
        else {
            manualRedirect(json);
        }
    }

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