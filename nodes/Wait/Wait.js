"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
class Wait {
    constructor() {
        this.label = 'Wait';
        this.name = 'wait';
        this.icon = 'wait.svg';
        this.type = 'action';
        this.category = 'Utilities';
        this.version = 1.0;
        this.description = 'Wait before continuing with the execution';
        this.incoming = 1;
        this.outgoing = 1;
        this.inputParameters = [
            {
                label: 'Unit',
                name: 'unit',
                type: 'options',
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
                    },
                    {
                        label: 'Days',
                        name: 'days'
                    }
                ],
                default: 'seconds',
                description: 'The time unit of the duration to wait'
            },
            {
                label: 'Duration',
                name: 'duration',
                type: 'number',
                default: 10,
                description: 'Duration to wait before continuing with the execution'
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const startWaitDate = new Date().toUTCString();
        const unit = inputParametersData.unit;
        let duration = inputParametersData.duration || 1;
        if (unit === 'minutes') {
            duration *= 60;
        }
        if (unit === 'hours') {
            duration *= 60 * 60;
        }
        if (unit === 'days') {
            duration *= 60 * 60 * 24;
        }
        duration *= 1000;
        const endWaitDate = new Date(new Date().getTime() + duration).toUTCString();
        const returnData = [
            {
                start: startWaitDate,
                end: endWaitDate,
                duration,
                unit
            }
        ];
        return new Promise((resolve, _) => {
            setTimeout(() => {
                resolve((0, utils_1.returnNodeExecutionData)(returnData));
            }, duration);
        });
    }
}
module.exports = { nodeClass: Wait };
//# sourceMappingURL=Wait.js.map