import bot from './bot'

// Main
let launch = () => {
  
    bot.launchHandlers();
    bot.launchBot();

    setInterval(async () => {
        await bot.Notifications();
    }, 60000);
    
};

launch();