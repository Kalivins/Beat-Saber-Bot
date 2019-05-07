import Discord from 'discord.js'
import fs from 'fs'
import getJSON from 'get-json';
const client = new Discord.Client()
const config = require('./botConfig.json')

module.exports.launchBot = () => {

    client.login(config.token);

    client.on('ready', () => {
        client.user.setActivity("Beta 0.1");
    });

    client.on('message', message => {
        if (message.content.substring(0, 2) == "bs") {
        
            let messageArray = message.content.split(" ");
            let cmd = messageArray[1];
            let commandFile = client.commands.get(cmd);
    
            if (commandFile) commandFile.run(client, cmd, message);
        }
    });
}

// module.exports.initNotifications = async () => {

//     await getJSON('http://localhost/BSApi/maps/ranked/' + user, async function(error, response){
//         console.log(response);
//     });

// }

module.exports.launchHandlers = () => {
    client.commands = new Discord.Collection();
    var walkSync = function (dir, filelist) {
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function (file) {
            if (fs.statSync(dir + file).isDirectory()) {
                filelist = walkSync(dir + file + '/', filelist);
            } else {
                filelist.push(dir + file);
            }
        });
        return filelist;
    };
    var files = walkSync('./commands/');
    let jsfiles = files.filter(f => f.split(".").pop() === "js")
    if (jsfiles.length <= 0) {
        console.log("Aucune commandes enregistrer.");
        return;
    }

    jsfiles.forEach((f, i) => {
        let props = require(f);
        let moduleName = f.split('/');
        console.log(moduleName[3] + ' loaded !');
        client.commands.set(props.help.name, props);
    });
}