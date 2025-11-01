//function to hide console log in production

export  const hideConsoleLogInProduction = (message) => {
if(import.meta.env.VITE_NODE_ENV !== "production") {
    console.log(message);
}
}

