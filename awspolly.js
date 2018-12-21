/**
 * Send speech text to aws polly
 * @param {*} speechText 
 * @param {*} callback 
 * @returns AudioStream Buffer data
 */
function awsSpeech(speechText, callback) {
    
    var config = require('./awsconfig')
    
    var AWS = require('aws-sdk')

    var fs = require('fs')


    // Define region config explicitely
    AWS.config.update( { region : 'us-east-1'} )

    // Instantiate AWS Polly Object
    // This requires the awsconfig.js file
    // make sure you use your own aws file
    var Polly = new AWS.Polly(config)


    // We can now synthesize the speech text
    var result = Polly.synthesizeSpeech({
        LexiconNames : [],
        OutputFormat : 'mp3',
        SampleRate : '8000',
        Text : speechText,
        TextType : 'text',
        VoiceId : 'Joanna'
    }, callback)

}

module.exports = awsSpeech