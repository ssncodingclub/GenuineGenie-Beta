# GenuineGenie Discord Bot Beta

A bot that can do everything?   
+ The purpose of this repo is to accept open source contributions for GenuineGenie Discord Bot revamping process. 
+ Once sufficient command revamp has been done, this repo will replace the original repo as the source code of bot. 

# 🖥️ Code Walkthrough 

+ [index.js](index.js) is the brain of the discord bot. This file helps us connect to discord API to send and receive messages. 
+ [schema.txt](schema.txt) contains the schema of collections in mongodb. This file is just for our reference to help us during CRUD operations. 
+ [database folder](database) 
  + [mongo.js](database/mongo.js) is used to connect to mongodb database. It gets the connection URI from `config.json` or `.env` file *(config.json/.env was not pushed to the repo because it contains sensitive information like bot token)*
  + [database/schemas](database/schemas) files are used to get document values from mongodb collection. 
+ If [config.json]() is used, it will contain

```js
{
  "token": "",   
  "mongoURL": "",   
}
```

# 🤔 Where to add new commands?

+ New commands must be added to [commands folder](commands) under respective category as `.js` file.   
  For example, `daily` command is a `fun` category command. So it must be added inside [commands/fun/daily.js](commands/fun/daily.js) 
+ The final revamped version of beta bot will [look like this](https://github.com/ssncodingclub/discord-bot-GenuineGenie/tree/main/commands/commands) after adding all the commands under respective categories. 


# ✔️ Tasks to do

+ Move commands from [original discord bot](https://github.com/ssncodingclub/discord-bot-GenuineGenie/tree/main/commands) to beta bot's command folder. 
+ Come up with new command ideas and create issues. 
+ Work on feature issues and make PRs.
