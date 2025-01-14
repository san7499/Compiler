const express = require('express');
const app = express();
const bodyP = require('body-parser');
const compiler = require('compilex');
const fs = require('fs');
const cors = require('cors'); // Add CORS for cross-origin requests
const options = { stats: true };
compiler.init(options);

// Middleware for CORS


// Body parser for JSON requests
app.use(bodyP.json());
app.use(
  '/codemirror-5.65.18',
  express.static(__dirname + '/codemirror-5.65.18')
);

app.get("/", function (req, res) {
    compiler.flush(function () {
        console.log("deleted");
    });
    res.sendFile(__dirname + '/index.html');
});

app.post('/compile', function (req, res) {
    console.log(req.body);
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;

    try {
        if (lang === "Cpp") {
            var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
            if (!input) {
                compiler.compileCPP(envData, code, function (data) {
                    if (data.output) {
                        res.send({ success: true, output: data.output });
                    } else {
                        res.send({ success: false, error: data.error });
                    }
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send({ success: true, output: data.output });
                    } else {
                        res.send({ success: false, error: data.error });
                    }
                });
            }
        }
        else if (lang === "Java") {
            var envData = { OS: "windows" };
            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    if (data.output) {
                        res.send({ success: true, output: data.output });
                    } else {
                        res.send({ success: false, error: data.error });
                    }
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send({ success: true, output: data.output });
                    } else {
                        res.send({ success: false, error: data.error });
                    }
                });
            }
        }
        else if (lang === "Python") {
            var envData = { OS: "windows" };
            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    if (data.output) {
                        res.send({ success: true, output: data.output });
                    } else {
                        res.send({ success: false, error: data.error });
                    }
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send({ success: true, output: data.output });
                    } else {
                        res.send({ success: false, error: data.error });
                    }
                });
            }
        }
    } catch (e) {
        console.log("error", e);
        res.status(500).send("Internal Server Error");
    }
});

process.on('exit', function () {
    compiler.flush(() => console.log('Temporary files cleaned up'));
});

app.listen(5000, function () {
    console.log('Server is running on http://localhost:5000');
});
