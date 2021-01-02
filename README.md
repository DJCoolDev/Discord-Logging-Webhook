# What can you do with discord-logging-webhook

You can log easily stuff with user discord webhooks

# Installation

`npm i discord-logging-webhook --save`

# Usage
```
const webhook = require("discord-logging-webhook")
 
const Logger = new webhook.Webhook("WEBHOOK URL HERE")
```
## Success message
```
Logger.success("Succsess-Information","This is a succsess message.")
```
![Success](https://djcool.de/storage/cloud/DiscordLoggingWebhook/Success.PNG "Example")

```
const webhook = require("discord-logging-webhook")
 
const Logger = new webhook.Webhook("WEBHOOK URL HERE")

Logger.info("Website-Information","The webite is loading very fast.")

Logger.warn("Warning-System", "The page loads very slowly.")

Logger.err("Error-Information","The page is broken, you can't open it")

Logger.success("Succsess-System","Yay, the website is online.")
```

# Bugs

You can report bugs [here](https://github.com/DJCoolDev/Discord-Logging-Webhook/issues). In my free time i will fix them.
