let express = require('express');
let router = express.Router();
let wss = require('../websocket');
let shell = require('child_process');
let ws;


wss.on('connection', function (wsItem) {
    ws = wsItem
});

/* GET users listing. */
router.all('/wh/listen', function (req, res) {
    if (ws === undefined) {
        res.json({message: "客户端未连接."})
    }else{
        ws.send(JSON.stringify({
            headers: req.headers,
            body:req.body
        }),(err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
        res.json({message: "ok"})
    }
});

router.all('/wh/update',function (req, res) {
    let index = __dirname.lastIndexOf('WebhookServer');
    let path = __dirname.substr(0,index + 'WebhookServer'.length);
    shell.exec('sh ' + path + '/AppUpdate.sh', (error, stdout, stderr) => {
        res.json({
            error: error,
            stdout: stdout,
            stderr: stderr
        })
    })
});

module.exports = router;