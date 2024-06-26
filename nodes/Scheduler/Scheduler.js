"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const utils_1 = require("../../src/utils");
const events_1 = __importDefault(require("events"));
class Scheduler extends events_1.default {
    constructor() {
        super();
        this.label = 'Scheduler';
        this.name = 'scheduler';
        this.icon = 'scheduler.svg';
        this.type = 'scheduler';
        this.category = 'Utilities';
        this.version = 1.1;
        this.description = 'Start workflow at scheduled times';
        this.incoming = 0;
        this.outgoing = 1;
        this.cronJobs = {};
        this.inputParameters = [
            {
                label: 'Pattern',
                name: 'pattern',
                type: 'options',
                options: [
                    {
                        label: 'Repetitive',
                        name: 'repetitive',
                        description: 'Workflow will be triggered repetitively every X'
                    },
                    {
                        label: 'Once',
                        name: 'once',
                        description: 'Workflow will be triggered only once at specific time'
                    }
                ],
                default: 'repetitive'
            },
            {
                label: 'Date Time',
                name: 'specificDateTime',
                type: 'date',
                description: 'Choose a specific date time to trigger the workflow once',
                show: {
                    'inputParameters.pattern': ['once']
                }
            },
            {
                label: 'Schedules',
                name: 'scheduleTimes',
                type: 'array',
                show: {
                    'inputParameters.pattern': ['repetitive']
                },
                array: [
                    {
                        label: 'Mode',
                        name: 'mode',
                        type: 'options',
                        options: [
                            {
                                label: 'Every Day',
                                name: 'everyDay'
                            },
                            {
                                label: 'Every Week',
                                name: 'everyWeek'
                            },
                            {
                                label: 'Every Month',
                                name: 'everyMonth'
                            },
                            {
                                label: 'Every X',
                                name: 'everyX'
                            },
                            {
                                label: 'Every Specific Time',
                                name: 'specific'
                            }
                        ],
                        default: 'everyDay'
                    },
                    {
                        label: 'Specific Date Time',
                        name: 'specificDateTime',
                        type: 'date',
                        description: 'Choose a specific date time to trigger the workflow',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['specific']
                        }
                    },
                    {
                        label: 'Hour',
                        name: 'hour',
                        type: 'number',
                        hide: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX', 'specific']
                        },
                        default: new Date().getHours(),
                        description: '[24H Format] Scheduled hour to trigger workflow'
                    },
                    {
                        label: 'Minute',
                        name: 'minute',
                        type: 'number',
                        hide: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX', 'specific']
                        },
                        default: new Date().getMinutes(),
                        description: '[0 - 59] Scheduled minute to trigger workflow'
                    },
                    {
                        label: 'Day of Month',
                        name: 'dayOfMonth',
                        type: 'number',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyMonth']
                        },
                        default: new Date().getDate(),
                        description: '[1 - 31] Scheduled day to trigger workflow'
                    },
                    {
                        label: 'Weekday',
                        name: 'weekday',
                        type: 'options',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyWeek']
                        },
                        options: [
                            {
                                label: 'Monday',
                                name: '1'
                            },
                            {
                                label: 'Tuesday',
                                name: '2'
                            },
                            {
                                label: 'Wednesday',
                                name: '3'
                            },
                            {
                                label: 'Thursday',
                                name: '4'
                            },
                            {
                                label: 'Friday',
                                name: '5'
                            },
                            {
                                label: 'Saturday',
                                name: '6'
                            },
                            {
                                label: 'Sunday',
                                name: '0'
                            }
                        ],
                        default: new Date().getDay().toString(),
                        description: 'Scheduled weekday to trigger workflow'
                    },
                    {
                        label: 'Value',
                        name: 'value',
                        type: 'number',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX']
                        },
                        default: 1,
                        description: 'Scheduled X seconds/minutes/hours to trigger workflow'
                    },
                    {
                        label: 'Unit',
                        name: 'unit',
                        type: 'options',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX']
                        },
                        options: [
                            {
                                label: 'Seconds',
                                name: 'seconds'
                            },
                            {
                                label: 'Minutes',
                                name: 'minutes'
                            },
                            {
                                label: 'Hours',
                                name: 'hours'
                            }
                        ],
                        default: 'hours',
                        description: 'Units of scheduled X seconds / minutes / hours'
                    }
                ]
            }
        ];
    }
    async runTrigger(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const pattern = inputParametersData.pattern;
        const scheduleTimes = inputParametersData.scheduleTimes;
        const cronTimes = [];
        if (pattern === 'once') {
            const specificDateTime = inputParametersData.specificDateTime;
            cronTimes.push(dateToCron(new Date(specificDateTime)));
        }
        else {
            for (const scheduleItem of scheduleTimes) {
                if (scheduleItem.mode === 'everyX') {
                    if (scheduleItem.unit === 'seconds') {
                        // Every X seconds
                        cronTimes.push(`*/${scheduleItem.value} * * * * *`);
                    }
                    else if (scheduleItem.unit === 'minutes') {
                        // Every X minutes
                        cronTimes.push(`*/${scheduleItem.value} * * * *`);
                    }
                    else if (scheduleItem.unit === 'hours') {
                        // At 0 minutes past the hour, every X hours
                        cronTimes.push(`0 */${scheduleItem.value} * * *`);
                    }
                }
                if (scheduleItem.mode === 'everyDay') {
                    const minute = scheduleItem.minute || '0';
                    const hour = scheduleItem.hour || '0';
                    // At XX:XX AM/PM, every days
                    cronTimes.push(`${minute} ${hour} * * *`);
                }
                if (scheduleItem.mode === 'everyWeek') {
                    const minute = scheduleItem.minute || '0';
                    const hour = scheduleItem.hour || '0';
                    const weekday = scheduleItem.weekday || '0';
                    // At XX:XX AM/PM, only on Monday/Tuesday...
                    cronTimes.push(`${minute} ${hour} * * ${weekday}`);
                }
                if (scheduleItem.mode === 'everyMonth') {
                    const minute = scheduleItem.minute || '0';
                    const hour = scheduleItem.hour || '0';
                    const dayOfMonth = scheduleItem.dayOfMonth || '0';
                    // At XX:XX AM/PM, on day X of the month
                    cronTimes.push(`${minute} ${hour} ${dayOfMonth} * *`);
                }
                if (scheduleItem.mode === 'specific') {
                    const specificDateTime = scheduleItem.specificDateTime;
                    cronTimes.push(dateToCron(new Date(specificDateTime)));
                }
            }
        }
        const emitEventKey = nodeData.emitEventKey;
        // The function to fire at the specified time
        const onTick = () => {
            const returnData = [];
            returnData.push({
                date: new Date().toDateString(),
                time: new Date().toTimeString(),
                cron: 'SUCCESS'
            });
            this.emit(emitEventKey, (0, utils_1.returnNodeExecutionData)(returnData));
            if (pattern === 'once')
                this.removeTrigger(nodeData);
        };
        // Start the cron-jobs
        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            for (const cronTime of cronTimes) {
                // Automatically start the cron job
                this.cronJobs[emitEventKey].push(new cron_1.CronJob(cronTime, onTick, undefined, true));
            }
        }
        else {
            for (const cronTime of cronTimes) {
                // Automatically start the cron job
                this.cronJobs[emitEventKey] = [new cron_1.CronJob(cronTime, onTick, undefined, true)];
            }
        }
    }
    async removeTrigger(nodeData) {
        const emitEventKey = nodeData.emitEventKey;
        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            const cronJobs = this.cronJobs[emitEventKey];
            for (const cronJob of cronJobs) {
                cronJob.stop();
            }
            this.removeAllListeners(emitEventKey);
        }
    }
}
const dateToCron = (date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth();
    const dayOfWeek = date.getDay();
    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};
module.exports = { nodeClass: Scheduler };
//# sourceMappingURL=Scheduler.js.map
