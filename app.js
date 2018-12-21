const express = require('express')
const app = express()
const fs = require('fs')
const port = 8081


function gather(digit, action, audio){
    var x = `<Gather numDigits=${digit} action='${action}'>`
    x += `<Play>${audio}</Play>`
    x += `</Gather>`
    return x
}

function play(action,audio){
    return `<Play> action='${action}'>${audio}</Play>`
}

function forward(location){
    return `<Forward>${location}</Forward>`
}


/**
 * Default route sends 404 not found
 */
app.get('/', (req,res) => {    
    console.log(req.query)
    res.end(404)
})

function serveHttpAudioFile(req,res){
    
    var audio = './audio/speech.wav'

    if( fs.existsSync(audio) ) {
        console.log('Reading speech.wav file')

        fs.readFile('./audio/speech.wav', (err,data) => {
            if(err){
                console.log(err.stack)
                res.statusCode == 500
                res.end('Error reading audio file')
            } else {
                console.log('Serving audio file ')
                res.setHeader('Content-Type', 'wav' | 'audio/wav')
                res.send(data)
            }

        })

    }
    
}

/**
 * Serve speech.wav file
 */
app.get('/audio/speech.wav', serveHttpAudioFile)


function processTicket(req,res){
    console.log(req.query)
    res.end()
}

/**
 * Handle Tickets
 */
app.get('/ticket', processTicket)

/**
 * Web Responder Entry point
 */
app.get('/webresponder', (req,res) => {    
    console.log(req.query)
    var speech = require('./awspolly')
    var prepareWav = require('./prepare-wav')

    var httpSrv = 'http://pre.clearclouds.ca:8081'

    speech('<speak>Welcome to John\'s IVR Control responder.  Press 1 to learn more.</speak>', function (err, data) {
        if (err) console.log(err.stack)
        else
            prepareWav(data, (wavefile) => {
                console.log('Your 8bit 8000Hz wave file is now ready \n' + wavefile)

                var result = gather(1, `${httpSrv}/ticket`, `${httpSrv}/audio/speech.wav`)
                console.log(result)
                res.send(result)                
            })
    })

})




app.listen(port, () => console.log(`Serving requests on port : ${port}!`))