const express = require('express')
const app = express()

const config = require('./config.json')
const routeFunc =  require('./routeFunc')

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
app.get('/audio/:wavefile', routeFunc.serveHttpAudioFile)

/**
 * Handle cases based on request
 */
app.get('/case', routeFunc.handleCase)

/**
 * Web Responder Entry point
 */
app.get('/webresponder', routeFunc.handleWebResponder )

app.listen( config.httpSrv.port, () => console.log(`Serving requests on port : ${config.httpSrv.port}!`))
