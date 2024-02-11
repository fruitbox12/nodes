"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const nodemailer_1 = require("nodemailer");
class EmailSend {
    constructor() {
        this.label = 'Send Email';
        this.name = 'emailSend';
        this.icon = 'emailsend.svg';
        this.type = 'action';
        this.category = 'Communication';
        this.version = 1.0;
        this.description = 'Send email to single or multiple receipients';
        this.incoming = 1;
        this.outgoing = 1;
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'Email Send Smtp',
                        name: 'emailSendSmtp'
                    }
                ],
                default: 'emailSendSmtp'
            }
        ];
        this.inputParameters = [
            {
                label: 'From Email',
                name: 'fromEmail',
                type: 'string',
                default: '',
                description: 'Email address of the sender.'
            },
            {
                label: 'To Email',
                name: 'toEmail',
                type: 'string',
                default: '',
                description: 'Email address of the recipient. Multiple emails can be comma-separated.',
                optional: true
            },
            {
                label: 'CC Email',
                name: 'ccEmail',
                type: 'string',
                default: '',
                description: 'Email address of CC recipient. Multiple emails can be comma-separated.',
                optional: true
            },
            {
                label: 'Subject',
                name: 'subject',
                type: 'string',
                default: '',
                description: 'Subject line of the email.'
            },
            {
                label: 'Body - Plain Text',
                name: 'text',
                type: 'string',
                rows: 5,
                default: '',
                description: 'Plain text message of email.',
                optional: true
            },
            {
                label: 'Body - HTML',
                name: 'html',
                type: 'string',
                rows: 5,
                default: '',
                description: 'HTML text message of email.',
                optional: true
            },
            {
                label: 'Ignore SSL',
                name: 'ignoreSSL',
                type: 'boolean',
                default: false,
                description: 'Send email regardless of SSL validation.',
                optional: true
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        if (credentials === undefined) {
            throw new Error('Missing credentials');
        }
        const fromEmail = inputParametersData.fromEmail;
        const toEmail = inputParametersData.toEmail;
        const ccEmail = inputParametersData.ccEmail;
        const subject = inputParametersData.subject;
        const text = inputParametersData.text;
        const html = inputParametersData.html;
        const ignoreSSL = inputParametersData.ignoreSSL;
        const connectionOptions = {
            host: credentials.host,
            port: credentials.port,
            secure: credentials.secure
        };
        if (credentials.user || credentials.password) {
            connectionOptions.auth = {
                user: credentials.user,
                pass: credentials.password
            };
        }
        if (ignoreSSL) {
            connectionOptions.tls = {
                rejectUnauthorized: false
            };
        }
        const transporter = (0, nodemailer_1.createTransport)(connectionOptions);
        const mailOptions = {
            from: fromEmail,
            to: toEmail,
            cc: ccEmail,
            subject,
            text,
            html
        };
        const info = await transporter.sendMail(mailOptions);
        const returnData = [];
        if (Array.isArray(info)) {
            returnData.push(...info);
        }
        else {
            returnData.push(info);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: EmailSend };
//# sourceMappingURL=EmailSend.js.map