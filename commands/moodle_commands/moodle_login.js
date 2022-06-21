const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const fs = require("fs");

async function get_next_message_content_in_priv_channel(priv_channel, cleanup_func){
  const msg_filter = () => true;
  var message_content = await priv_channel.awaitMessages(
    { filter: msg_filter, max: 1,time: 30000,errors:["time"]}
  ).then(
    async function(collected) {
      return collected.first().content;
    }
  ).catch(
    async function() {
      await priv_channel.send("No Response. Terminating.");
      await cleanup_func(success=false,channel = priv_channel)
      return null;
    }
  );
  return message_content
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moodlelogin')
		.setDescription('Logs You Into Moodle'),

  async execute(interaction) {
    const privatechannel = await interaction.guild.channels.create(
      `${interaction.member.id}`,{type: 'text'}
    );
    await privatechannel.permissionOverwrites.set([
      {
        id:interaction.guild.roles.everyone,
        deny:['VIEW_CHANNEL', 'SEND_MESSAGES'],
      },
      {
        id:interaction.member.id,
        allow:['VIEW_CHANNEL', 'SEND_MESSAGES'],
      },
    ]);
    var prompt = await interaction.reply(
      { content: `Go To ${privatechannel} to continue the process!`, fetchReply:true }
    );

    // Call this just before the entire workflow completes.
    async function cleanup_interaction(success=false, channel, moodle_id=null){
      if (channel){
        await channel.send("Cleaning Up...");
        await channel.delete();
      }
      if (success){
        await prompt.edit(prompt.content+`\nEDIT: Successfully logged you in! Your moodleid is ${moodle_id}`)
      }
      else{
        await prompt.edit(prompt.content+"\nEDIT: Sadly, I couldn't log you in. Try again, maybe.")
      }
    }
    
    await privatechannel.send("Reply to this message with your Moodle Username:");

    var moodleusername = await get_next_message_content_in_priv_channel(privatechannel,cleanup_interaction);

    if (moodleusername == null){return}
    
    await privatechannel.send(`Reply to this message with your Moodle Password for the username \`${moodleusername}\`:`);

    var moodlepassword = await get_next_message_content_in_priv_channel(privatechannel,cleanup_interaction);
    
    if (moodlepassword == null){return}

    await privatechannel.send(`Cool! That's all I need. Thanks!`);
    
    var params = new URLSearchParams({
      'username' : moodleusername,
      'password' :moodlepassword,
      'service' : 'moodle_mobile_app'
    });

    var response = await fetch('https://lms.ssn.edu.in/login/token.php', {method: 'POST', body: params});
    
    var data = await response.json()
    if ("error" in data){
      await privatechannel.send("Your credentials appear to be incorrect. Try again!")
      await cleanup_interaction(success=false,channel=privatechannel);
    }
    else if ("token" in data){
      token = data["token"];
      params = new URLSearchParams({
        'wstoken' : token,
        'wsfunction' : 'core_user_get_users_by_field',
        'field' : 'username',
        'values[0]' : moodleusername,
        'moodlewsrestformat' : 'json'
      });
      response = await fetch('https://lms.ssn.edu.in/webservice/rest/server.php', {method: 'POST', body: params});
      data = await response.json()

      moodleid = data[0]["id"]
      // console.log(interaction.member.id,moodleusername,moodleid,token)
      // Begin temporary usage of JSON
      const path = `${__dirname}/users.json`
      var users = require(path)
      users[interaction.member.id] = {
        "moodleusername":moodleusername,
        "moodleid":moodleid,
        "token":token
      }
      fs.writeFile(path, JSON.stringify(users), async (err) => {
        if (err) throw err;
        await privatechannel.send("Saved details.")
      });
      // End temporary usage of JSON
      // Replace above with database calls.
      await cleanup_interaction(success=true,channel=privatechannel,moodle_id=moodleid);
    }
    return
  },
};
