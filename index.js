var http = require('http');
var url = require('url');

function getNewPokeyHandler(_options_) {
    var options = _options_;
    return function pokeyHandler(req, res) {

        // Go home favicon, you're drunk!
        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.end();
            //console.log('favicon requested');
            return;
        }

        var url_parts = url.parse(req.url, true),
            number = 1 * url_parts.query.n,
            a = {
                number: number,
                about: options.about(),
                result: typeof number === 'undefined' ? options.noData() : options.func(number),
                delay_in_seconds:  Math.random() * (options.delay ? options.delay() : 3)
            };

        setTimeout(function () {
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.end(JSON.stringify(a));
        }, a.delay_in_seconds * 1000);
    };
}

function getTimeStamp() {
    var now = new Date();
    return now.getFullYear() +
        leadingZero(now.getMonth() + 1) +
        leadingZero(now.getDate()) +
        leadingZero(now.getMinutes()) +
        leadingZero(now.getSeconds())
        ;
}

function leadingZero(n) {
    return n < 10 ? "0" + n : "" + n;
}

function doubleIt() {
    return {
        about: function () {
            return "This function returns double the number given.";
        },
        func: function (x) {
            return x * 2;
        },
        noData: function () {
            return 0;
        }
    };
}

function content() {
    return {
        about: function () {
            return "This function returns silly content.";
        },
        func: function (x) {
            return "The giant squid (genus Architeuthis) is a deep-ocean dwelling squid in the family Architeuthidae. Giant squid can grow to a tremendous size (see Deep-sea gigantism): recent estimates put the maximum size at 13 m (43 ft) for females and 10 m (33 ft) for males from the posterior fins to the tip of the two long tentacles (second only to the colossal squid at an estimated 14 m (46 ft),[2] one of the largest living organisms). The mantle is about 2 m (6.6 ft) long (more for females, less for males), and the length of the squid excluding its tentacles is about 5 m (16 ft). Claims of specimens measuring 20 m (66 ft) or more have not been scientifically documented.";
        },
        noData: function () {
            return "No content available.";
        },
        delay: function () {
            return 5;
        }
    };
}

function time() {
    return {
        about: function () {
            return "The current time";
        },
        func: function (x) {
            return getTimeStamp();
        },
        noData: function (x) {
            return getTimeStamp();
        }
    }
}

function seq() {
    var seq = 0;
    return {
        about: function () {
            return "This returns the next number in a sequence. Positive values increment by that much. Others reset."
        },
        func: function (x) {
            seq = x <= 0 ? 1 : seq + x;
            return seq;
        },
        noData: function () {
            return ++seq;
        }
    }
}

http.createServer(getNewPokeyHandler(doubleIt())).listen(3000);
http.createServer(getNewPokeyHandler(content())).listen(3001);
http.createServer(getNewPokeyHandler(time())).listen(3002);
http.createServer(getNewPokeyHandler(seq())).listen(3003);



