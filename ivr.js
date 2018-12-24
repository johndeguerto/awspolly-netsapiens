const ivrControl = {
    /**
     * IVR Control for gathering input
     * @param {*} digit 
     * @param {*} action 
     * @param {*} audio 
     */
    gather(digit, action, audio){
        var x = `<Gather numDigits='${digit}' action='${action}'>`
        x += `<Play>${audio}</Play>`
        x += `</Gather>`
        return x
    },

    /**
     * IVR control for playing audio
     * @param {*} action 
     * @param {*} audio 
     */
    play(action,audio){
        console.log('Playing %s', action)
        return `<Play action="${action}">${audio}</Play>`
    },

    forward(location){
        return `<Forward>${location}</Forward>`
    }
}
module.exports = ivrControl