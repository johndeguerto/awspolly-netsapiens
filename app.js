const express = require('express')
const app = express()
const fs = require('fs')
const port = 8081

var speech = require('./awspolly')
var prepareWav = require('./prepare-wav')
const config = require('./config.json')
const httpSrv = config.httpSrv.url + ':' + config.httpSrv.port

function gather(digit, action, audio){
    var x = `<Gather numDigits='${digit}' action='${action}'>`
    x += `<Play>${audio}</Play>`
    x += `</Gather>`
    return x
}

function play(action,audio){
    return `<Play action="${action}">${audio}</Play>`
}

function forward(location){
    return `<Forward>${location}</Forward>`
}

/**
 * Default route sends 404 not found
 */
app.get('/', (req,res) => {    
    console.log('Undefined request')
    res.statusCode == 404
    res.end()
})

function serveHttpAudioFile(req,res){
    
    var audio = './audio/' + req.params.wavefile    

    if( fs.existsSync(audio) ) {
        console.log('Reading ' + audio + ' file')

        fs.readFile(audio, (err,data) => {
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
 * Serve wave file
 */
app.get('/audio/:wavefile', serveHttpAudioFile)


function processTicket(req,res){
    console.log(req.query)
    console.log('Process Ticket callback initiated.')

    switch(req.query.Digits){
        case '1':
            var str = "<speak>A lawyer is standing in a long line at the box office. Suddenly, he feels a pair of hands kneading his shoulders, back, and neck. The lawyer turns around.<break/>"
            str += "What the hell do you think you're doing?<break/>"
            str += "<emphasis level=\"strong\">I'm a chiropractor</emphasis>, and I'm just keeping in practice while I'm waiting in line.<break/>"
            str += "Well, <emphasis>I'm a lawyer</emphasis>, <break/>but you don't see me screwing the guy in front of me, do you?</speak>"

            speech(str, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        console.log('Your 8 bit 8000Hz wave file is now ready for speech \n' + wavefile)                        
                        var result = play(`${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)
                        console.log(result)
                        res.send(result)
                    })
            })

        break;
        case '2':

        break;

        case '3':
            res.send( forward(9059525258) )
        break;

        case '9':
            speech(menuSpeech(), function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = gather(1, `${httpSrv}/ticket`, `${httpSrv}/${wavefile}`)
                        console.log(result)
                        res.send(result)                
                    })
            })
        break;

        default:
            console.log('Default case triggered')
            speech(`<speak>Option # ${req.query.Digits} is not one of the options.<break time="1s"/> Please try again!</speak>`, (err,data) => {
                if(err) console.log(err.stack)
                    prepareWav(data, (wavefile) => {                        
                        var result = gather(1, `${httpSrv}/ticket`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)                
                    }) 
            })


        break;

    }

}

function menuSpeech() {
    var context = `
        <speak><prosody volume="medium"><emphasis level="strong">Welcome</emphasis></prosody> to the main menu!<break/>
        <p>Please listen to the following options<break time="1s"/></p>
        <p>If you are calling for the joke of the day.  press 1.</p>
        <p>If you are calling to submit a ticket, please press 2 now.</p>
        <p>or to speak to our technical support department, press 3</p>
        <break time="1s"/>
        <p>To repeat the options again, press 9.</p>
        </speak>
    `
    return context
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

    speech(menuSpeech(), function (err, data) {
        if (err) console.log(err.stack)
        else
            prepareWav(data, (wavefile) => {
                console.log('Your 8bit 8000Hz wave file is now ready \n' + wavefile)
                var result = gather(1, `${httpSrv}/ticket`, `${httpSrv}/${wavefile}`)
                console.log(result)
                res.send(result)                
            })
    })

})




app.listen(port, () => console.log(`Serving requests on port : ${config.httpSrv.port}!`))
