"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TelegramApi {
    constructor() {
        this.name = 'telegramApi';
        this.version = 1.0;
        this.credentials = [
            {
                label: 'Bot Token',
                name: 'botToken',
                type: 'string',
                placeholder: 'eg: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHI',
                default: '',
                description: 'Telegram bot token. <a target="_blank" href="https://www.youtube.com/watch?v=MZixi8oIdaA">Learn how to get it</a>'
            }
        ];
    }
}
module.exports = { credClass: TelegramApi };
//# sourceMappingURL=TelegramApi.js.map