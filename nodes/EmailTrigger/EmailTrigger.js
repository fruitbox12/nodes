"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
const imap_1 = __importDefault(require("imap"));
const moment_1 = __importDefault(require("moment"));
const mailparser_1 = require("mailparser");
class EmailTrigger extends events_1.default {
    constructor() {
        super();
        this.label = 'Email Trigger';
        this.name = 'emailTrigger';
        this.icon = 'email-trigger.svg';
        this.type = 'trigger';
        this.category = 'Communication';
        this.version = 1.0;
        this.description = 'Start workflow whenever a new email is received';
        this.incoming = 0;
        this.outgoing = 1;
        this.providers = {};
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Imap',
                        name: 'imap'
                    }
                ],
                default: 'imap'
            }
        ];
    }
    async runTrigger(nodeData) {
        const credentials = nodeData.credentials;
        if (credentials === undefined) {
            throw new Error('Imap credentials missing');
        }
        let timeNow = new Date().getTime();
        const imap = new imap_1.default({
            user: credentials.userEmail,
            password: credentials.password,
            host: credentials.host,
            port: credentials.port,
            tls: credentials.tls
        });
        const openInbox = (cb) => {
            imap.openBox('INBOX', true, cb);
        };
        imap.once('ready', () => {
            openInbox((err) => {
                if (err)
                    throw (0, utils_1.handleErrorMessage)(err);
                imap.on('mail', () => {
                    try {
                        imap.search(['NEW', ['SINCE', (0, moment_1.default)().format('MMMM D, YYYY')]], (err, results) => {
                            if (err)
                                throw (0, utils_1.handleErrorMessage)(err);
                            if (!results || !results.length) {
                                this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)({ message: 'No new unread emails' }));
                            }
                            const f = imap.fetch(results, { bodies: '', markSeen: true });
                            f.on('message', (msg) => {
                                msg.on('body', (stream) => {
                                    (0, mailparser_1.simpleParser)(this.stream, (err, mail) => {
                                        var _a;
                                        if (err)
                                            throw (0, utils_1.handleErrorMessage)(err);
                                        const returnData = {
                                            from: mail.headers.get('from'),
                                            to: mail.headers.get('to'),
                                            subject: mail.subject,
                                            date: mail.date,
                                            text: mail.text,
                                            htmlText: mail.textAsHtml,
                                            html: mail.html
                                        };
                                        if (mail.headers.has('cc'))
                                            returnData.cc = mail.headers.get('cc');
                                        if (mail.headers.has('bcc'))
                                            returnData.bcc = mail.headers.get('bcc');
                                        // Convert Buffer to base64 string
                                        if (mail.attachments && mail.attachments.length) {
                                            for (let i = 0; i < mail.attachments.length; i += 1) {
                                                ;
                                                mail.attachments[i].content = `data:${mail.attachments[i].contentType};base64,${mail.attachments[i].content.toString('base64')}`;
                                            }
                                            returnData.attachments = mail.attachments;
                                        }
                                        const emailDate = (_a = mail.date) === null || _a === void 0 ? void 0 : _a.getTime();
                                        if (emailDate && timeNow < emailDate) {
                                            timeNow = emailDate;
                                            this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnData));
                                        }
                                    });
                                });
                            });
                            f.once('error', (err) => {
                                console.error('on mail error: ', err);
                                throw new Error('Email Trigger Error: ' + err);
                            });
                        });
                    }
                    catch (err) {
                        console.error(err);
                        throw new Error('Email Trigger Error: ' + err);
                    }
                });
            });
        });
        imap.once('error', (err) => {
            console.error('imap error = ', err);
            throw new Error('Email Trigger Error: ' + err);
        });
        imap.connect();
        const emitEventKey = nodeData.emitEventKey;
        this.providers[emitEventKey] = { provider: imap };
    }
    async removeTrigger(nodeData) {
        const emitEventKey = nodeData.emitEventKey;
        if (Object.prototype.hasOwnProperty.call(this.providers, emitEventKey)) {
            const provider = this.providers[emitEventKey].provider;
            if (provider)
                provider.end();
            this.removeAllListeners(emitEventKey);
        }
    }
}
module.exports = { nodeClass: EmailTrigger };
//# sourceMappingURL=EmailTrigger.js.map