const speech = require('./awspolly')
const randomstring = require('randomstring')
const fs = require('fs')

function prepareWav(dataStream,callback) {
    const { exec } = require('child_process')
    var randName = randomstring.generate()
    var tmpFile = '/tmp/' + randName + '.mp3'
    var speechWav = '/tmp/speech.wav' 

    if(dataStream.AudioStream instanceof Buffer){
        fs.writeFile(tmpFile, dataStream.AudioStream, (err) => {
            if(err) console.log(err.stack)

            console.log('Aws generated file has been saved in the ' + tmpFile)

            var tmpWav = '/tmp' + randName + '.wav'
            exec('/usr/bin/mpg123 -w ' + tmpWav + ' ' + tmpFile, (err, stdout, stderr) => {
                if(err) console.log(err.stack)

                exec('/usr/bin/sox ' + tmpWav + ' -e mu-law -r 8000 -c 1 -b 8 ' + speechWav, (err, stdout,stderr) => {
                    if(err) console.log(err.stack)

                    callback(speechWav)
                })
            })            
        })
    }

}

speech('Hello there', function(err,data) {
    if(err) console.log(err.stack)
    else
    prepareWav(data, (wavefile)=>{
        console.log(wavefile)
    })
})





