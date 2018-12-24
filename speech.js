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

module.exports = speechText