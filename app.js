const express = require('express')
const app = express()
const fs = require('fs')
const port = 8081

var speech = require('./awspolly')
var prepareWav = require('./prepare-wav')
const config = require('./config.json')
const httpSrv = config.httpSrv.url + ':' + config.httpSrv.port

/**
 * Amazon AWS Polly SSML formatted text
 */
const speechText = {
    case1 : '<speak>You have selected Option # 1</speak>',
    case2 : '<speak>You have selected Option # 2</speak>',
    case3 : '<speak>You have selected Option # 3</speak>',
    menu : `
        <speak><prosody volume="medium"><emphasis level="strong">Welcome</emphasis></prosody> to the main menu!<break/>
        <p>Please listen to the following options<break time="1s"/></p>
        <p>For option 1 press 1</p>
        <p>For option 2 press 2</p>
        <p>For option 3 press 3</p>
        <break time="1s"/>
        <p>To repeat the options again, press #.</p>
        </speak>
    `
}

/**
 * IVR Control for gathering input
 * @param {*} digit 
 * @param {*} action 
 * @param {*} audio 
 */
function gather(digit, action, audio){
    var x = `<Gather numDigits='${digit}' action='${action}'>`
    x += `<Play>${audio}</Play>`
    x += `</Gather>`
    return x
}

/**
 * IVR control for playing audio
 * @param {*} action 
 * @param {*} audio 
 */
function play(action,audio){
    return `<Play action="${action}">${audio}</Play>`
}

function forward(location){
    return `<Forward>${location}</Forward>`
}

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



function handleCase(req,res){
    console.log(req.query)
    console.log('Process case callback initiated.')

    switch(req.query.Digits){
        case '1':
            speech( speechText.case1, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = play(`${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)
                    })
            })

        break;
        case '2':
            speech( speechText.case2, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = play(`${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)
                    })
            })
        break;

        case '3':
            speech( speechText.case3, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = play(`${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)
                    })
            })
        break;

        case '#':
            speech( speechText.menu, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = gather(1, `${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)
                        console.log(result)
                        res.send(result)                
                    })
            })
        break;

        default:            
            speech(`<speak>Option # ${req.query.Digits} is not one of the options.<break time="1s"/> Please try again!</speak>`, (err,data) => {
                if(err) console.log(err.stack)
                    prepareWav(data, (wavefile) => {                        
                        var result = gather(1, `${httpSrv}/case`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)                
                    }) 
            })

        break;

    }

}


/**
 * Default route sends 404 not found
 */
app.get('/', (req,res) => {    
    console.log('Undefined request')
    res.statusCode == 404
    res.end()
})

/**
 * Serve wave file
 */
app.get('/audio/:wavefile', serveHttpAudioFile)

/**
 * Handle cases based on request
 */
app.get('/case', handleCase)

/**
 * Web Responder Entry point
 */
app.get('/webresponder', (req,res) => {    
    speech( speechText.menu, function (err, data) {
        if (err) console.log(err.stack)
        else
            prepareWav(data, (wavefile) => {                
                var result = gather(1, `${httpSrv}/case`, `${httpSrv}/${wavefile}`)                
                res.send(result)                
            })
    })
})


app.listen(port, () => console.log(`Serving requests on port : ${config.httpSrv.port}!`))
