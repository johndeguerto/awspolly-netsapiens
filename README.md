# awspolly-netsapiens
Generate a wav file that can be used for netsapiens To-Web dial translation

# Install mpg123 and sox, required for preparing wav file for netsapiens use
```sudo apt-get install mpg123 sox```

# Create config.json to store your http and port info
```
{
    "httpSrv" : {
        "url" : "http://localhost",
        "port" : "8081"
    }
}
```

#Create awsconfig.js with the following content.
```
const awsconfig = {
    accessKeyId : '<yourkeyid>',
    secretAccessKey : 'yourAccessKey'
}

module.exports = awsconfig
```

# Todo list:
[x] Write the web responder to handle IVR Control posted from Netsapiens NMS
[ ] Make calls using netsapiens web-call applications
