/**
 * Convert Mp3 to wav for NDP compatibility
 * @param {*} dataStream 
 * @param {*} callback 
 */
function prepareWav(dataStream, callback) {
    const speech = require('./awspolly')
    const randomstring = require('randomstring')
    const fs = require('fs')    
    const { exec } = require('child_process')
    var randName = randomstring.generate()
    var tmpFile = '/tmp/' + randName + '.mp3'
    var speechWav = '/tmp/speech.wav'

    if (dataStream.AudioStream instanceof Buffer) {
        fs.writeFile(tmpFile, dataStream.AudioStream, (err) => {
            if (err) console.log(err.stack)
            
            var tmpWav = '/tmp/' + randName + '.wav'                        

            exec('/usr/bin/mpg123 -w ' + tmpWav + ' ' + tmpFile, (err, stdout, stderr) => {
                if (err) console.log(err.stack)

                exec('/usr/bin/sox ' + tmpWav + ' -e mu-law -r 8000 -c 1 -b 8 ' + speechWav, (err, stdout, stderr) => {
                    if (err) console.log(err.stack)
                    exec('cp ' + speechWav + ' ./audio')
                    callback(speechWav)
                })
            })

        })
    }
}

module.exports = prepareWav