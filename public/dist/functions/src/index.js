"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const sendGridEmail = require("@sendgrid/mail");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
const TEMPLATE_TO_SENDER = functions.config().sendgrid.templatetosender;
sendGridEmail.setApiKey(SENDGRID_API_KEY);
exports.staszek_ovh_form = functions.firestore.document('/mails/{mailsId}').onCreate((snap) => {
    const messageData = snap.data();
    const msg = {
        to: 'staszek.zajaczkowski@gmail.com',
        from: 'ktulu.inc@gmail.com',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            name: messageData.name,
            email: messageData.email,
            location: messageData.location,
            message: messageData.message,
        },
    };
    return sendGridEmail
        .send(msg)
        .then(() => console.log('email sent'))
        .catch((error) => { throw new Error(error.toString()); });
});
exports.staszek_ovh_form_to_sender = functions.firestore.document('/mails/{mailsId}').onCreate((snap) => {
    const messageData = snap.data();
    const msg = {
        to: messageData.email,
        from: 'ktulu.inc@gmail.com',
        templateId: TEMPLATE_TO_SENDER,
        dynamic_template_data: {
            message: messageData.message,
        },
    };
    return sendGridEmail
        .send(msg)
        .then(() => console.log('email sent'))
        .catch((error) => { throw new Error(error.toString()); });
});
