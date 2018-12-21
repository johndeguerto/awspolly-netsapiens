# awspolly-netsapiens
Generate a wav file that can be used for netsapiens To-Web dial translation

## Install mpg123 and sox
```sudo apt-get install mpg123, sox```

##Create awsconfig.js with the following content.

```
const awsconfig = {
    accessKeyId : '<yourkeyid>',
    secretAccessKey : 'yourAccessKey'
}

module.exports = awsconfig
```


# Upcoming:
> write the web responder to handle IVR Control posted from Netsapiens NMS
