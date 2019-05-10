import getJSON from 'get-json';
import Discord from 'discord.js'

module.exports.run = async (bot, cmd, message) => {

    await getJSON('http://localhost/scrapper/songs/scoresset', async function(error, response){

        if(error) {
            message.channel.send("Une erreur est survenue");
            console.log(error);
            return;
        }

        let r = await response;
        console.log(r);

        const embed = new Discord.RichEmbed()
                        .setTitle('**Les 10 dernières maps "scores set" sur Score Saber :**')
                        .setColor(0x00AE86)
                        .setThumbnail('https://bsaber.com/wp-content/uploads/2019/02/Scoresaber-Wall-1-770x433.jpg')
                        .setTimestamp()
                        .setURL('https://scoresaber.com/')
                        .setFooter("From Beat Saber Scrapper by Zozote", "https://a.ppy.sh/6170067?1550864788.jpeg");

        for(var i = 0; i < 8; i++) {
            embed.addField(r.scoresset_maps[i].name, '['+r.scoresset_maps[i].difficulty+']('+r.scoresset_maps[i].download+')');
        }
        
        message.channel.send({embed});
    });

}
module.exports.help = {
    name: "scoresset",
    commande: "bs scoresset",
    level: "Public",
    description: "Récupère les 10 dernières maps ranked"
}