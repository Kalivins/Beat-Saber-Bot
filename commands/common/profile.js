import getJSON from 'get-json';
import Discord from 'discord.js'
import core from '../../bot';

module.exports.run = async (bot, cmd, message) =>{

    let msg = message.content.split(' ');
    let user = msg[2];
    if(user == undefined) {
        user = core.getUserById(message.member.id);
        if(user == undefined || user.length == 0) {
            user = message.member.user.tag.split('#').shift();
        }
    }
    
    let arg = msg[3];
    await getJSON('http://localhost/scrapper/profile/' + user, async function(error, response){

        if(error) {
            message.channel.send("Une erreur est survenue");
            console.log(error);
            return;
        }

        let r = await response;
        if(r.error != undefined && r.error.length > 0) {
            message.channel.send(r.error);
            console.log(r.error);
            return;
        }
        const embed = new Discord.RichEmbed()
                    .setTitle('**'+r.name+'**')
                    .setColor(0x00AE86)
                    .setThumbnail(r.avatar)
                    .setTimestamp()
                    .setURL(r.url)
                    .setFooter("From Beat Saber Scrapper by Zozote", "https://a.ppy.sh/6170067?1550864788.jpeg");

        switch(arg) {
            case 'tops':
                embed.addField("**Top ranks :**", " ----------- ");
                for(var i = 0; i < 8; i++) {
                    embed.addField(r.topRanks[i].name, '['+r.topRanks[i].difficulty+ ' '+r.topRanks[i].score+' Rank : '+r.topRanks[i].rank+']'+'('+r.topRanks[i].download+')');
                }
                break;
            case "recent":
                embed.addField("**Parties récentes :**", " ----------- ");
                for(var i = 0; i < 8; i++) {
                    embed.addField(r.recentScores[i].name, '['+r.recentScores[i].difficulty+ ' - ' + r.recentScores[i].score+']' + '('+r.recentScores[i].download+')');
                }
                break;
            default:
                embed.setDescription(r.resume)
                break;
        }
        await message.channel.send({embed});

        core.saveScoreSaberUser(user, message.member.id);
    });
    
    
}
module.exports.help = {
    name: "profile",
    commande: "bs pseudo",
    level: "Public",
    description: "Récupère le profil Score Saber du pseudo"
}