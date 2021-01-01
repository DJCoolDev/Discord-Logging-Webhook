const snekfetch = require("snekfetch");

const ENDPOINT = "https://discordapp.com/api/v7/webhooks";

class Webhook {

    constructor(url, nowait = false) {
        this.url = url;
        this.id = "";
        this.token = "";
        this.meta = {};
        this.ready = false;
        this.nowait = nowait;
        snekfetch.get(this.url)
            .then((res) => {
                let parsed = JSON.parse(res.text);
                Object.assign(this.meta, parsed);
                this.id = parsed.id;
                this.token = parsed.token;
                this.ready = true;
            })
            .catch((err) => {
                throw err;
            });
    }

    verifyName(name) {
        if (name.length > 32) {
            throw new Error(`The name specified was ${name.length} characters. Discord webhook names must be under 32 characters`);
        }
    }

    checkFieldValueLength(value) {
        if (value.length > 1024)
            throw new Error(`The value given was ${value.length} characters, fields of Discord embeds must be under 1024 characters`);
    }

    checkFields(payload) {
        if (!payload) {
            return new Promise((resolve) => resolve());
        }

        if (Object.keys(payload).indexOf("fields") == -1) {
            return new Promise((resolve) => resolve());
        }

        return new Promise((resolve) => {
            const checks = [];

            for (var i = 0; i < payload.fields.length; i++) {
                checks.push(this.checkFieldValueLength(payload.fields[i].value));
            }

            Promise.all(checks).then(() => {
                resolve();
            });
        });

    }

    sendPayload(payloadRaw, resolveFunction) {
        let payload = this.sanitiseEmbeds(payloadRaw);
        this.verifyName(payload.username);
        this.checkFields(payload.attachments[0]).then(() => {
            if (this.ready) {
                return new Promise((resolve, reject) => {
                    snekfetch.post(this.endpoint)
                        .send(payload)
                        .then((response) => {
                            if (resolveFunction) {
                                resolveFunction(response);
                            }

                            resolve();
                        })
                        .catch((err) => {
                            let e = JSON.parse(err.text);

                            if (e.code === 50006) { // We've sent an empty message
                                reject({ error: "No content specified" });
                            }

                            if (e.retry_after) { // We are being ratelimited
                                setTimeout(() => {
                                    this.sendPayload(payload, resolve);
                                }, e.retry_after);
                            } else {
                                reject(err);
                            }
                        });
                });
            } else {
                setTimeout(() => {
                    this.sendPayload(payload, resolveFunction);
                }, 10);
            }
        });

    }

    get endpoint() {
        let qs = "";
        if (this.nowait) {
            qs = "?wait=false";
        }
        return `${ENDPOINT}/${this.id}/${this.token}/slack${qs}`;
    }

    err(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#ff0000",
                "fields": [{
                    "title": "Error",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }

    info(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#00fffa",
                "fields": [{
                    "title": "Information",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }

    success(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#04ff00",
                "fields": [{
                    "title": "Success",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }

    warn(name, message) {
        let payload = {
            "username": name,
            "attachments": [{
                "color": "#ffe900",
                "fields": [{
                    "title": "Warning",
                    "value": message
                }],
                "ts": new Date() / 1000
            }]
        };

        return this.sendPayload(payload);
    }

    sanitiseEmbeds(data) {
        // Need to copy a derefenced object so we don't touch the messagebuilder
        let newPayload = Object.assign({}, data);

        if (data.attachments.length > 0) {
            if (
                Object.keys(data.attachments[0]).length > 1 ||
                data.attachments[0].fields.length > 0
            ) {
                // There is an embed
                return newPayload;
            } else {
                // No embeds
                newPayload.attachments = [];
                return newPayload;
            }
        } else {
            return newPayload;
        }
    }
}


module.exports = {
    Webhook
};
