"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../src/utils");
const vm2_1 = require("vm2");
class NodeJS {
    constructor() {
        this.label = 'NodeJS';
        this.name = 'nodeJS';
        this.icon = 'nodejs.png';
        this.type = 'action';
        this.category = 'Development';
        this.version = 1.0;
        this.description = 'Execute code within NodeVM sandbox';
        this.incoming = 1;
        this.outgoing = 1;
        this.inputParameters = [
            {
                label: 'Code',
                name: 'code',
                type: 'code',
                default: `console.info($nodeData);\nconst example = 'Hello World!';\nreturn example;`,
                description: 'Custom code to run'
            },
            {
                label: 'External Modules',
                name: 'external',
                type: 'json',
                placeholder: '["axios"]',
                description: 'Import installed dependencies within Outerbridge',
                optional: true
            }
        ];
    }
    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        const returnData = [];
        // Global object
        const sandbox = {
            $nodeData: nodeData
        };
        const options = {
            console: 'inherit',
            sandbox,
            require: {
                external: false,
                builtin: ['*']
            }
        };
        const code = inputParametersData.code || '';
        const external = inputParametersData.external;
        if (external) {
            const deps = JSON.parse(external);
            if (deps && deps.length) {
                options.require.external = {
                    modules: deps
                };
            }
        }
        const vm = new vm2_1.NodeVM(options);
        let responseData; // tslint:disable-line: no-any
        try {
            if (!code)
                responseData = [];
            else {
                responseData = await vm.run(`module.exports = async function() {${code}}()`, __dirname);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
        if (Array.isArray(responseData)) {
            returnData.push(...responseData);
        }
        else {
            returnData.push(responseData);
        }
        return (0, utils_1.returnNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: NodeJS };
//# sourceMappingURL=NodeJS.js.map