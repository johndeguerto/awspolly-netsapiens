# awspolly-netsapiens
This a web responder to netsapiens To-Web dial translation.  It will use AWS Polly TTS and convert the mp3 to wav compatible format for Netsapiens.

## Features:
- [x] Use star codes on the phone to initiate the responder
- [x] Present options and wait for user response
- [x] Use Aws Polly to convert TTS to Mp3
- [x] Convert Mp3 to ulaw compatible format

## How to Install?
```
git clone https://github.com/johndeguerto/awspolly-netsapiens

```

## Install mpg123 and sox, required for preparing wav file for netsapiens use
```sudo apt-get install mpg123 sox```

## Create config.json to store your http and port info
```
{
    "httpSrv" : {
        "url" : "http://localhost",
        "port" : "8081"
    }
}
```

## Create awsconfig.js with the following content.
```
const awsconfig = {
    accessKeyId : '<yourkeyid>',
    secretAccessKey : 'yourAccessKey'
}

module.exports = awsconfig
```

## Create a dial translation that points to your web responder as shown below
![Web Responder Image](https://raw.githubusercontent.com/johndeguerto/awspolly-netsapiens/master/audio/image1.png)

