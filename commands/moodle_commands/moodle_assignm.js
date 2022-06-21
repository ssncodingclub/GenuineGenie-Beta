const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

const path = `${__dirname}/users.json`
var users = require(path)

async function is_user_logged_in(userid_to_check){
  for (let userid in users){
    if (userid == userid_to_check){
      return true
    }
  }
  return false
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moodle_assignm')
		.setDescription('Lists incomplete moodle assignments.'),
	async execute(interaction) {
    if (await is_user_logged_in(interaction.member.id)){
      prompt = await interaction.deferReply(); // Gives us 15 minutes.
      const token = users[interaction.member.id]["token"]; // Replace with DB call

      var params_get_all_assigns = new URLSearchParams({
        'wstoken' : token,
        'wsfunction' : 'mod_assign_get_assignments',
        'moodlewsrestformat' : 'json'})
      response_get_all_assigns = await fetch(
        'https://lms.ssn.edu.in/webservice/rest/server.php',
        {method: 'POST', body: params_get_all_assigns}
      );
      var data_get_all_assigns = await response_get_all_assigns.json()
      var incomplete_assignments = {};
      var complete_assignments = {};
      for (let courseid in data_get_all_assigns["courses"]){
        var course_incomplete_assignments = [];
        var course_complete_assignments = [];
        for (
          let assignmentid in data_get_all_assigns["courses"][courseid]["assignments"]
        ){
          var assign_id = data_get_all_assigns["courses"][courseid]["assignments"][assignmentid]["id"]
          var params_get_assign_submission_status = new URLSearchParams(
            {'wstoken' : token,
            'wsfunction' : 'mod_assign_get_submission_status',
            'assignid' : assign_id,
            'moodlewsrestformat' : 'json'}
          )
          var response_get_assign_submission_status = await fetch(
            'https://lms.ssn.edu.in/webservice/rest/server.php',
            {method: 'POST', body: params_get_assign_submission_status});
          var data_get_assign_submission_status = await response_get_assign_submission_status.json()
          if (data_get_assign_submission_status["lastattempt"]["submission"]["status"] == "submitted"){ 
            course_complete_assignments.push(
              data_get_all_assigns["courses"][courseid]["assignments"][assignmentid]["name"]
            )
          }
          else{
            course_incomplete_assignments.push(
              data_get_all_assigns["courses"][courseid]["assignments"][assignmentid]["name"]
            )
          }
        }
        incomplete_assignments[data_get_all_assigns["courses"][courseid]["shortname"]] = course_incomplete_assignments
        complete_assignments[data_get_all_assigns["courses"][courseid]["shortname"]] = course_complete_assignments
      }
      var prompt = await interaction.editReply(
        { content: `Incomplete Assignments : ${JSON.stringify(incomplete_assignments,null,4)}`, fetchReply:true });
    }
    else{
      var prompt = await interaction.reply(
        { content: `You're not logged in.`, fetchReply:true });
    }
	},
};