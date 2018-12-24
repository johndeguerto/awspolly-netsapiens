
const ivr = require('./ivr')
const fs = require('fs')
const config = require('./config.json')
const speechText = require('./speech')
const prepareWav = require('./prepare-wav')
const speech = require('./awspolly')

const httpSrv = config.httpSrv.url + ':' + config.httpSrv.port

const routeFunc = {

serveHttpAudioFile(req,res){
    
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
    
},

handleCase(req,res){
    console.log(req.query)
    console.log('Process case callback initiated.')

    switch(req.query.Digits){
        case '1':
            speech( speechText.case1, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = ivr.play(`${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)
                    })
            })

        break;
        case '2':
            speech( speechText.case2, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = ivr.play(`${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)
                    })
            })
        break;

        case '3':
            speech( speechText.case3, function (err, data) {
                if (err) console.log(err.stack)
                else
                    prepareWav(data, (wavefile) => {
                        var result = ivr.play(`${httpSrv}/webresponder`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)
                    })
            })
        break;

        default:            
            speech(`<speak>Option # ${req.query.Digits} is not one of the options.<break time="1s"/> Please try again!</speak>`, (err,data) => {
                if(err) console.log(err.stack)
                    prepareWav(data, (wavefile) => {                        
                        var result = ivr.gather(1, `${httpSrv}/case`, `${httpSrv}/${wavefile}`)                        
                        res.send(result)                
                    }) 
            })

        break;

    }

},

handleWebResponder( req,res) {
    speech( speechText.menu, function (err, data) {
        if (err) console.log(err.stack)
        else
            prepareWav(data, (wavefile) => {                
                var result = ivr.gather(1, `${httpSrv}/case`, `${httpSrv}/${wavefile}`)                
                res.send(result)                
            })
    })
}
}

module.exports = routeFunc