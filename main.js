import bot from './bot'

// Main
let launch = () => {
  
    bot.launchHandlers();
    // bot.initNotifications();
    bot.launchBot();
    
};

launch();