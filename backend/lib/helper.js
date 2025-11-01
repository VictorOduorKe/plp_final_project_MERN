//function to hide console log in production

const hideConsoleLogInProduction = (message) => {
    if(process.env.NODE_ENV !== "production") {
        console.log(message);
    }
}

module.exports = { hideConsoleLogInProduction };