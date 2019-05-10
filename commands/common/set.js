import core from '../../bot';

module.exports.run = async (bot, cmd, message) =>{

    let msg = message.content.split(' ');
    let arg = msg[2];
    switch(arg) {
        case 'username':
            let user = msg[3];
            core.saveScoreSaberUser(user, message.member.id);
            await message.channel.send("L'utilisateur "+user+" as bien été ajoutée sous votre compte discord");
            break;
    }
    
    
    
    
}
module.exports.help = {
    name: "set",
    commande: "bs set",
    level: "Public",
    description: "Ajoute un pseudo dans la base de donnée"
}