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

module.exports.saveScoreSaberUser = async (user, userid) => {

    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err)
            console.log(err);

        let obj = JSON.parse(data);
        obj.users.find((element, key) => {
            if(user != undefined) {
                if(parseInt(element.userid) == userid) {
                    obj.users[key].username = user;
                } else {
                    obj.users.push({username : user, userid : userid});
                }
            }
        });
        let json = JSON.stringify(obj);
        fs.writeFile('users.json', json, 'utf8', (err, result) => {
            if(err)
                console.log(err);
          });
    });

}

module.exports.getUserById = (userid) => {

    let username = '';
    let file = require('./users.json');

    file.users.find((element) => {
        if(element.userid == userid) {
            username = element.username;
        } else {
            username = '';
        }
    });

    return username;
    
}

module.exports.Notifications = async () => {

    await getJSON('http://localhost/scrapper/songs/ranked', async function(error, response){
        let r = await response;
        
        let lastrankedMap = r.ranked_maps[0];
        saveNewRankedMap(lastrankedMap);
    });

}

let saveNewRankedMap = async (map) => {

    let name = map.name;
    let guild = client.guilds.find('name', 'Zozote');
    let role = guild.roles.find('name', 'Beat Saber');
    let channel = guild.channels.find('name', 'new_ranked_maps_bs');

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err)
            console.log(err);

        let obj = JSON.parse(data);
        name = name.trim();
        console.log(map.image);
        if(map != undefined) {
            if(obj.lastrankedMap == name) {
                obj.lastrankedmap = name;
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle('**'+name+'**')
                    .setColor(0x00AE86)
                    .setThumbnail(map.image)
                    .setTimestamp()
                    .setURL(map.download)
                    .setDescription("**"+map.name+" - "+map.difficulty+"**")
                    .setFooter("From Beat Saber Scrapper by Zozote", "https://a.ppy.sh/6170067?1550864788.jpeg");

                channel.send(role + " **Nouvelle map ranked sur Score Saber**", embed);
                obj.lastrankedmap = name;
            }
        }
        let json = JSON.stringify(obj);
        fs.writeFile('data.json', json, 'utf8', (err, result) => {
            if(err)
                console.log(err);
          });
    });

}

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