const http = require("http");
const ical = require("node-ical");
const fs = require("fs");
const schedule = require('node-schedule');

var events;
var lastCheckedICS = "";
var newtab = true;

http.createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Max-Age", 2592000);

    switch (req.url.toLowerCase()) {
        case "/settrue":
            res.writeHead(200, { "Content-Type": "text/plain" });
            newtab = true;
            res.write("true");
            break;
        case "/setfalse":
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write("false");
            newtab = false;
            break;
        case "/auto":
            res.writeHead(200, { "Content-Type": "text/html" });
            var page = fs.readFileSync('auto.html', 'utf8');
            res.write(page);
            break;
        case "/autojs":
            res.writeHead(200, { "Content-Type": "text/javascript" });
            var page = fs.readFileSync('auto.js', 'utf8');
            res.write(page);
            break;
        case "/manual":
            res.writeHead(200, { "Content-Type": "text/html" });
            var page = fs.readFileSync('manual.html', 'utf8');
            res.write(page);
            break;
        case "/manualjs":
            res.writeHead(200, { "Content-Type": "text/javascript" });
            var page = fs.readFileSync('manual.js', 'utf8');
            res.write(page);
            break;
        case "/test":
            res.writeHead(200, { "Content-Type": "text/html" });
            var page = fs.readFileSync('test.html', 'utf8');
            res.write(page);
            break;
        default:
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(createJSON()));
            break;
    }

    res.end();
}).listen(8080);

getICS();
var getICSSchedule = schedule.scheduleJob('* * */6 * * *', function() {
    getICS();
});

async function getICS() {
    const events = await ical.async.fromURL('http://calendar.google.com/calendar/ical/friscoisd.org_fkh06qo0i2hdr9rf8ddrbv086o%40group.calendar.google.com/public/basic.ics');
    var date = new Date();
    lastCheckedICS = date.toLocaleString("en-us", { timeZone: 'America/Chicago' });
};

function createJSON() {
    if (!events) {
        events = ical.sync.parseFile('basic.ics');
    }

    var json = JSON.parse(fs.readFileSync("classes.json"));
    json.day = {};
    json.day.day = getDay();
    json.day.lastChecked = lastCheckedICS + (lastCheckedICS != "" ? " CT" : "");
    json.openInNewTab = newtab;

    return json;
}

function getDay() {
    var today = new Date();

    for (const event of Object.values(events)) {
        var eDate = new Date(event.start);
        if (
            eDate.toDateString() == today.toLocaleDateString('en-us', { timeZone: "America/Chicago" }) &&
            (event.summary == 'A DAY' || event.summary == 'B DAY')
        ) {
            return event.summary[0];
        }
    }
    return "not_found";
}


/*
var today;
var day;

var url;

//create a server object:
http
    .createServer(function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET");
        res.setHeader("Access-Control-Max-Age", 2592000);

        url = req.url.split('?');

        const events = ical.sync.parseFile("basic.ics");

        today = new Date();
        day = "";

        for (const event of Object.values(events)) {
            var eDate = new Date(event.start);
            if (
                eDate.getMonth() === today.getMonth() &&
                eDate.getDay() === today.getDay() &&
                eDate.getFullYear() === today.getFullYear() &&
                (event.summary == 'A DAY' || event.summary == 'B DAY')
            ) {
                day = event.summary[0];
            }
        }

        if (req.method === "GET") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            switch (url[0]) {
                case "/url-auto":
                    res.write(auto());
                    break;

                case "/url-manual":
                    res.write(manual());
                    break;

                default:
                    res.write("AB Parser");
                    break;
            }
        }

        res.statusCode = 200;
        res.end();
    })
    .listen(8080);

function auto() {
    var classes = JSON.parse(fs.readFileSync("classes.json"));

    var currentMins = today.getHours() * 60 + today.getMinutes();

    if (day == "A") {
        if (currentMins >= (9 * 60 + 0) && currentMins <= (10 * 60 + 30)) {
            return classes["A"]["1"];
        }
        else if (currentMins >= (10 * 60 + 35) && currentMins <= (12 * 60 + 10)) {
            return classes["A"]["2"];
        }
        else if (currentMins >= (13 * 60 + 0) && currentMins <= (14 * 60 + 30)) {
            return classes["A"]["3"];
        }
        else if (currentMins >= (15 * 60 + 5) && currentMins <= (16 * 60 + 35)) {
            return classes["A"]["4"];
        }
    }
    else if (day == "B") {
        if (currentMins >= (9 * 60 + 0) && currentMins <= (10 * 60 + 30)) {
            return classes["B"]["1"];
        }
        else if (currentMins >= (10 * 60 + 35) && currentMins <= (12 * 60 + 10)) {
            return classes["B"]["2"];
        }
        else if (currentMins >= (12 * 60 + 50) && currentMins <= (14 * 60 + 50)) {
            return classes["B"]["3"];
        }
        else if (currentMins >= (14 * 60 + 55) && currentMins <= (16 * 60 + 25)) {
            return classes["B"]["4"];
        }
    }
    return sendBack();
}

function manual() {
    var classes = JSON.parse(fs.readFileSync("classes.json"));
    return classes[url[1][1]][url[1][0]];
}

function sendBack() {
    return "not_in_range";
}
*/