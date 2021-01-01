# What can you do with discord-logging-webhook

You can log easily stuff with user discord webhooks

# Installation

`npm i discord-logging-webhook --save`

Then...

```
const webhook = require("webhook-discord")
 
const Logger = new webhook.Webhook("WEBHOOK URL HERE")

Logger.info("Website-Information","The webite is loading very fast.")

Logger.warn("Warning-System", "The page loads very slowly.")

Logger.err("Error-Information","The page is broken, you can't open it")

Logger.success("Succsess-System","Yay, the website is online.")
```