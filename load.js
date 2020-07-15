const chalkAnimation = require('chalk-animation')

let str = 'Loading...';
const rainbow = chalkAnimation.rainbow(str);
 
// Add a new dot every second
setInterval(() => {
    rainbow.replace(str += '.');
}, 1000);
