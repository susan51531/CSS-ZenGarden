var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var util = require('util');

var mimeTypes = {
    '.html': 'html',
    '.js': 'javascript',
    '.css': 'css',
    '.ico': 'ico'
};

var head1 = fs.readFileSync('head01.html');
var head2 = fs.readFileSync('head02.html');
var head3 = fs.readFileSync('head03.html');
var head4 = fs.readFileSync('head04.html');

function padding(n) {
    return ("000" + n).substr(-3);
}
http.createServer(function(request, response) {
    var requestURL = url.parse(decodeURI(request.url), true);
    var lookup = requestURL.pathname;
    var cssfile = requestURL.query ? requestURL.query.cssfile : null;
    var fileName;
    if (lookup === '/') {
        fileName = '/index.html';
    } else if (lookup[lookup.length - 1] === '/') {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end('Dir:' + lookup);
    } else fileName = lookup;
    var hostPath = ".";
    fileName = hostPath + fileName;
    fs.exists(fileName, function(exits) {
        if (exits) {
            fs.readFile(fileName, function(err, data) {
                if (err) {
                    response.writeHead(500);
                    response.end('Server Error!');
                    return;
                }
                var headers = {
                    'Content-Type': 'text/' + mimeTypes[path.extname(fileName)] || 'plain'
                };

                response.writeHead(200, headers);
                if(!cssfile && fileName === './index.html'){
                	cssfile=1;
                }
                if (cssfile) {
                    var cssfileId = parseInt(cssfile);
                    cssfile = padding(cssfileId);
                    data = head1 + '@import \"' + cssfile + '/' + cssfile + '.css\";' + head2;
                    var nextPage = cssfileId; 
                    var prePage = cssfileId;

                    // 108,129,183
                    if(cssfileId !== 212){
                        if(cssfileId === 107 || cssfileId === 128 || cssfileId === 182)
                            nextPage += 2;
                        else
                            nextPage +=1;
                    }

                    // 108,129,183
                    if(cssfileId !== 1){
                        if(cssfileId === 109 || cssfileId === 130 || cssfileId === 184)
                            prePage -= 2;
                        else
                            prePage -=1;
                    }

                    var tmp = head3.toString().replace(/([^0-9]*)([0-9]+)([^0-9]*)([0-9]+)([^0-9]*)/,
	                    	 "$1" + padding(nextPage) + "$3" 
	                    	 + padding(prePage) + "$5");
                    data += tmp + head4;
                }
                response.end(data);
            });
            return;
        }
        response.writeHead(404, {
            'Content-Type': 'text/html'
        });
        response.end('File Not Found!');
    });
}).listen(8085);

console.log('server running at localhost:8085');
