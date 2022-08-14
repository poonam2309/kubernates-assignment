const express = require('express')
const os = require('os')
const timestamp = Date.now();

const dateObject = new Date(timestamp);
const date = dateObject.getDate();
const month = dateObject.getMonth() + 1;
const year = dateObject.getFullYear();
// current hours
const hours = dateObject.getHours();

// current minutes
const minutes = dateObject.getMinutes();

// current seconds
const seconds = dateObject.getSeconds();
const app = express()
app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({ Timestamp: `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`,Hostname:`${os.hostname()}`}))

});
	//res.send(`Timestamp=${year}-${month}-${date} ${hours}:${minutes}:${seconds}\nHostname=${os.hostname()}`)

const port = 3000
app.listen(port, () => console.log(`listening on port ${port}`))
