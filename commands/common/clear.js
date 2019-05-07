module.exports.run = async (bot, cmd, message) =>{

if(cmd == "clear")
    {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Nope.");
        message.channel.bulkDelete(10).then(() =>{
            message.channel.send(10 + ' messages supprimé !').then(message => message.delete(5000));
        });
    }
}

module.exports.help = {
    name: "clear",
    commande: "!clear {number}",
    level: "Admin",
    description: "Clear le nombre de messages indiqué"
}