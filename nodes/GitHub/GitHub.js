"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../../src/utils");
class GitHub {
    constructor() {
        this.label = 'GitHub';
        this.name = 'GitHub';
        this.icon = 'GitHub-Logo.png';
        this.type = 'action';
        this.category = 'Development';
        this.version = 1.0;
        this.description = 'GitHub API';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        label: 'List User Repositories',
                        name: 'listUserRepositories',
                        description: 'Lists public repositories for the specified user.'
                    },
                    {
                        label: 'List Organization Repositories',
                        name: 'listOrganizationRepositories',
                        description: 'Lists repositories for the specified organization.'
                    },
                    {
                        label: 'List repository issues',
                        name: 'listRepositoryIssues',
                        description: 'List issues in a repository.'
                    },
                    {
                        label: 'Create an issue',
                        name: 'createIssue',
                        description: 'Any user with pull access to a repository can create an issue.'
                    },
                    {
                        label: 'Get an issue',
                        name: 'getIssue',
                        description: 'Get an issues in a repository.'
                    },
                    {
                        label: 'Update an issue',
                        name: 'updateIssue',
                        description: 'Update an issues in a repository.'
                    },
                    {
                        label: 'Lock an issue',
                        name: 'lockIssue',
                        description: "Users with push access can lock an issue or pull request's conversation."
                    },
                    {
                        label: 'Unlock an issue',
                        name: 'unlockIssue',
                        description: "Users with push access can unlock an issue's conversation."
                    }
                ]
            }
        ];
        this.credentials = [
            {
                label: 'Credential Method',
                name: 'credentialMethod',
                type: 'options',
                options: [
                    {
                        label: 'GitHub API',
                        name: 'gitHubApi'
                    }
                ],
                default: 'gitHubApi'
            }
        ];
        this.inputParameters = [
            {
                label: 'Owner/Organization',
                name: 'owner',
                type: 'string',
                show: {
                    'actions.operation': [
                        'listRepositoryIssues',
                        'createIssue',
                        'getIssue',
                        'updateIssue',
                        'lockIssue',
                        'unlockIssue',
                        'listUserRepositories',
                        'listOrganizationRepositories'
                    ]
                },
                description: 'The account owner of the repository. The name is not case sensitive.'
            },
            {
                label: 'Type',
                name: 'orgType',
                type: 'options',
                options: [
                    {
                        label: 'All',
                        name: 'all'
                    },
                    {
                        label: 'Public',
                        name: 'public'
                    },
                    {
                        label: 'Private',
                        name: 'private'
                    },
                    {
                        label: 'Forks',
                        name: 'forks'
                    },
                    {
                        label: 'Sources',
                        name: 'sources'
                    },
                    {
                        label: 'Member',
                        name: 'member'
                    },
                    {
                        label: 'Internal',
                        name: 'internal'
                    }
                ],
                show: {
                    'actions.operation': ['listOrganizationRepositories']
                },
                description: 'Specifies the types of repositories you want returned.',
                optional: true,
                default: 'all'
            },
            {
                label: 'Type',
                name: 'userType',
                type: 'options',
                options: [
                    {
                        label: 'All',
                        name: 'all'
                    },
                    {
                        label: 'Owner',
                        name: 'owner'
                    },
                    {
                        label: 'Member',
                        name: 'member'
                    }
                ],
                show: {
                    'actions.operation': ['listUserRepositories']
                },
                description: 'Specifies the types of repositories you want returned.',
                optional: true,
                default: 'owner'
            },
            {
                label: 'Sort',
                name: 'sort',
                type: 'options',
                options: [
                    {
                        label: 'Created',
                        name: 'created'
                    },
                    {
                        label: 'Updated',
                        name: 'updated'
                    },
                    {
                        label: 'Pushed',
                        name: 'pushed'
                    },
                    {
                        label: 'Full Name',
                        name: 'full_name'
                    }
                ],
                show: {
                    'actions.operation': ['listUserRepositories', 'listOrganizationRepositories']
                },
                description: 'The property to sort the results by.',
                optional: true,
                default: 'created'
            },
            {
                label: 'Direction of sort',
                name: 'direction',
                type: 'options',
                options: [
                    {
                        label: 'Ascending',
                        name: 'asc'
                    },
                    {
                        label: 'Descending',
                        name: 'desc'
                    }
                ],
                show: {
                    'actions.operation': ['listUserRepositories', 'listOrganizationRepositories']
                },
                description: 'The order to sort by.',
                optional: true,
                default: 'desc'
            },
            {
                label: 'Repository',
                name: 'repo',
                type: 'string',
                show: {
                    'actions.operation': ['listRepositoryIssues', 'createIssue', 'getIssue', 'updateIssue', 'lockIssue', 'unlockIssue']
                },
                description: 'The name of the repository. The name is not case sensitive.'
            },
            {
                label: 'Title',
                name: 'title',
                type: 'string',
                show: { 'actions.operation': ['createIssue'] },
                description: 'The title of the issue.'
            },
            {
                label: 'Title',
                name: 'titleOptional',
                type: 'string',
                show: { 'actions.operation': ['updateIssue'] },
                description: 'The title of the issue.',
                optional: true
            },
            {
                label: 'Body',
                name: 'body',
                type: 'string',
                show: { 'actions.operation': ['createIssue', 'updateIssue'] },
                description: 'The contents of the issue.',
                optional: true
            },
            {
                label: 'Issue Number',
                name: 'issueNumber',
                type: 'number',
                show: {
                    'actions.operation': ['getIssue', 'updateIssue', 'lockIssue', 'unlockIssue']
                },
                description: 'The number that identifies the issue.'
            },
            {
                label: 'Lock Reason',
                name: 'lockReason',
                type: 'options',
                options: [
                    {
                        label: 'Off Topic',
                        name: 'off-topic'
                    },
                    {
                        label: 'Too Heated',
                        name: 'too heated'
                    },
                    {
                        label: 'Resolved',
                        name: 'resolved'
                    },
                    {
                        label: 'Spam',
                        name: 'spam'
                    }
                ],
                show: { 'actions.operation': ['lockIssue'] },
                description: 'The reason for locking the issue or pull request conversation.',
                optional: true
            }
        ];
    }
    async run(nodeData) {
        const returnData = [];
        const actionData = nodeData.actions;
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        if (actionData === undefined || inputParametersData === undefined || credentials === undefined) {
            throw new Error('Required data missing');
        }
        const operation = actionData.operation;
        const accessToken = credentials.accessToken;
        let responseData;
        try {
            let method = 'GET';
            let url = '';
            const queryParameters = {};
            const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken
            };
            let dataString = {};
            const queryBody = {};
            if (operation === 'listUserRepositories' || operation === 'listOrganizationRepositories') {
                const owner = inputParametersData.owner;
                const type = operation === 'listUserRepositories' ? inputParametersData.userType : inputParametersData.orgType;
                const path = operation === 'listUserRepositories' ? 'users' : 'orgs';
                const sort = inputParametersData.sort;
                const direction = inputParametersData.direction;
                method = 'GET';
                url = `https://api.github.com/${path}/${owner}/repos`;
                if (type)
                    url += url.includes('?') ? `&type=${type};` : `?type=${type}`;
                if (sort)
                    url += url.includes('?') ? `&sort=${sort};` : `?sort=${sort}`;
                if (direction)
                    url += url.includes('?') ? `&direction=${direction};` : `?direction=${direction}`;
            }
            else if (operation === 'listRepositoryIssues') {
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                method = 'GET';
                url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues';
            }
            else if (operation === 'createIssue') {
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                const title = inputParametersData.title;
                const body = inputParametersData.body;
                method = 'POST';
                url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues';
                if (title)
                    dataString['title'] = title;
                if (body)
                    dataString['body'] = body;
            }
            else if (operation === 'getIssue') {
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                const issueNumber = inputParametersData.issueNumber;
                method = 'GET';
                url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber;
            }
            else if (operation === 'updateIssue') {
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                const issueNumber = inputParametersData.issueNumber;
                const title = inputParametersData.titleOptional;
                const body = inputParametersData.body;
                method = 'PATCH';
                url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber;
                if (title)
                    dataString['title'] = title;
                if (body)
                    dataString['body'] = body;
            }
            else if (operation === 'lockIssue') {
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                const issueNumber = inputParametersData.issueNumber;
                const lockReason = inputParametersData.lockReason;
                method = 'PUT';
                url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber + '/lock';
                if (lockReason)
                    dataString['lock_reason'] = lockReason;
            }
            else if (operation === 'unlockIssue') {
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                const issueNumber = inputParametersData.issueNumber;
                method = 'DELETE';
                url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issueNumber + '/lock';
            }
            const axiosConfig = {
                method,
                url,
                params: queryParameters,
                paramsSerializer: (params) => (0, utils_1.serializeQueryParams)(params),
                headers,
                data: dataString
            };
            if (Object.keys(queryBody).length > 0) {
                axiosConfig.data = queryBody;
            }
            const response = await (0, axios_1.default)(axiosConfig);
            responseData = response.data;
        }
        catch (error) {
            throw (0, utils_1.handleErrorMessage)(error);
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
module.exports = { nodeClass: GitHub };
//# sourceMappingURL=GitHub.js.map