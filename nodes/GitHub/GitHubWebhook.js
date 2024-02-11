"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../../src/utils");
class GitHubWebhook {
    constructor() {
        this.webhookMethods = {
            async createWebhook(nodeData, webhookFullUrl) {
                // Check if webhook exists
                const credentials = nodeData.credentials;
                const inputParametersData = nodeData.inputParameters;
                const actionsData = nodeData.actions;
                if (inputParametersData === undefined || actionsData === undefined) {
                    throw new Error('Required data missing');
                }
                if (credentials === undefined) {
                    throw new Error('Missing credentials');
                }
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                const baseUrl = `https://api.github.com/repos/${owner}/${repo}/hooks`;
                const accessToken = credentials.accessToken;
                const headers = {
                    Authorization: 'Bearer ' + accessToken
                };
                const axiosConfig = {
                    method: 'GET',
                    url: `${baseUrl}?per_page=100`,
                    headers
                };
                let webhookExist = false;
                const webhook_events = [];
                try {
                    const responseListWebhooks = await (0, axios_1.default)(axiosConfig);
                    const responseWebhooks = responseListWebhooks.data;
                    webhook_events.push(actionsData.events);
                    for (const webhook of responseWebhooks) {
                        if (webhook.events === webhook_events && webhook.config.url === webhookFullUrl) {
                            webhookExist = true;
                            break;
                        }
                    }
                }
                catch (err) {
                    if (err.response.status !== 404)
                        throw new Error(err);
                }
                if (!webhookExist) {
                    try {
                        const data = {
                            name: 'web',
                            config: {
                                content_type: 'json',
                                insecure_ssl: '0',
                                url: webhookFullUrl
                            },
                            events: webhook_events,
                            active: true
                        };
                        const axiosCreateConfig = {
                            method: 'POST',
                            url: baseUrl,
                            data,
                            headers
                        };
                        const createResponse = await (0, axios_1.default)(axiosCreateConfig);
                        const createResponseData = createResponse.data;
                        if (createResponseData && createResponseData.id) {
                            return createResponseData.id;
                        }
                        return;
                    }
                    catch (error) {
                        return;
                    }
                }
            },
            async deleteWebhook(nodeData, webhookId) {
                const credentials = nodeData.credentials;
                const inputParametersData = nodeData.inputParameters;
                const actionsData = nodeData.actions;
                if (inputParametersData === undefined || actionsData === undefined) {
                    throw new Error('Required data missing');
                }
                if (credentials === undefined) {
                    throw new Error('Missing credentials');
                }
                const owner = inputParametersData.owner;
                const repo = inputParametersData.repo;
                const baseUrl = `https://api.github.com/repos/${owner}/${repo}/hooks`;
                const accessToken = credentials.accessToken;
                const headers = {
                    Authorization: 'Bearer ' + accessToken
                };
                const axiosConfig = {
                    method: 'DELETE',
                    url: `${baseUrl}/${webhookId}`,
                    headers
                };
                try {
                    await (0, axios_1.default)(axiosConfig);
                }
                catch (error) {
                    return false;
                }
                return true;
            }
        };
        this.label = 'GitHub Webhook';
        this.name = 'GitHubWebhook';
        this.icon = 'GitHub-Logo.png';
        this.type = 'webhook';
        this.category = 'Development';
        this.version = 1.0;
        this.description = 'Start workflow whenever GitHub webhook event happened';
        this.incoming = 0;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Events',
                name: 'events',
                type: 'options',
                options: [
                    {
                        label: 'Branch Protection Rule',
                        name: 'branch_protection_rule',
                        description: 'Activity related to a branch protection rule.'
                    },
                    {
                        label: 'Check Run',
                        name: 'check_run',
                        description: 'Check run activity has occurred.'
                    },
                    {
                        label: 'Check Suite',
                        name: 'check_suite',
                        description: 'Check suite activity has occurred.'
                    },
                    {
                        label: 'Code Scanning Alert',
                        name: 'code_scanning_alert',
                        description: 'Activity related to code scanning alerts in a repository.'
                    },
                    {
                        label: 'Commit Comment',
                        name: 'commit_comment',
                        description: 'A commit comment is created.'
                    },
                    {
                        label: 'Create',
                        name: 'create',
                        description: 'A Git branch or tag is created.'
                    },
                    {
                        label: 'Delete',
                        name: 'delete',
                        description: 'A Git branch or tag is deleted.'
                    },
                    {
                        label: 'Dependabot Alert',
                        name: 'dependabot_alert',
                        description: 'Activity related to Dependabot alerts.'
                    },
                    {
                        label: 'Deploy Key',
                        name: 'deploy_key',
                        description: 'A deploy key is added or removed from a repository.'
                    },
                    {
                        label: 'Deployment',
                        name: 'deployment',
                        description: 'A deployment is created.'
                    },
                    {
                        label: 'Deployment Status',
                        name: 'deployment_status',
                        description: 'A deployment is created.'
                    },
                    {
                        label: 'Discussion',
                        name: 'discussion',
                        description: 'Activity related to a discussion.'
                    },
                    {
                        label: 'Discussion Comment',
                        name: 'discussion_comment',
                        description: 'Activity related to a comment in a discussion.'
                    },
                    {
                        label: 'Fork',
                        name: 'fork',
                        description: 'A user forks a repository.'
                    },
                    {
                        label: 'Github App Authorization',
                        name: 'github_app_authorization',
                        description: 'When someone revokes their authorization of a GitHub App, this event occurs. A GitHub App receives this webhook by default and cannot unsubscribe from this event.'
                    },
                    {
                        label: 'Gollum',
                        name: 'gollum',
                        description: 'A wiki page is created or updated.'
                    },
                    {
                        label: 'Installation',
                        name: 'installation',
                        description: 'Activity related to a GitHub App installation.'
                    },
                    {
                        label: 'Installation Repositories',
                        name: 'installation_repositories',
                        description: 'Activity related to repositories being added to a GitHub App installation.'
                    },
                    {
                        label: 'Issue Comment',
                        name: 'issue_comment',
                        description: 'Activity related to an issue or pull request comment. '
                    },
                    {
                        label: 'Issues',
                        name: 'issues',
                        description: 'Activity related to an issue.'
                    },
                    {
                        label: 'Label',
                        name: 'label',
                        description: 'Activity related to a label.'
                    },
                    {
                        label: 'Marketplace Purchase',
                        name: 'marketplace_purchase',
                        description: 'Activity related to a GitHub Marketplace purchase.'
                    },
                    {
                        label: 'Member',
                        name: 'member',
                        description: 'Activity related to repository collaborators.'
                    },
                    {
                        label: 'Membership',
                        name: 'membership',
                        description: 'Activity related to team membership.'
                    },
                    {
                        label: 'Merge Group',
                        name: 'merge_group',
                        description: 'Activity related to merge groups in a merge queue.'
                    },
                    {
                        label: 'Meta',
                        name: 'meta',
                        description: 'The webhook this event is configured on was deleted.'
                    },
                    {
                        label: 'Milestone',
                        name: 'milestone',
                        description: 'Activity related to milestones.'
                    },
                    {
                        label: 'Organization',
                        name: 'organization',
                        description: 'Activity related to an organization and its members.'
                    },
                    {
                        label: 'Org Block',
                        name: 'org_block',
                        description: 'Activity related to people being blocked in an organization. '
                    },
                    {
                        label: 'Package',
                        name: 'package',
                        description: 'Activity related to GitHub Packages.'
                    },
                    {
                        label: 'Page Build',
                        name: 'page_build',
                        description: 'Represents an attempted build of a GitHub Pages site,'
                    },
                    {
                        label: 'Ping',
                        name: 'ping',
                        description: 'When you create a new webhook, we send you a simple ping event to let you know you have set up the webhook correctly.'
                    },
                    {
                        label: 'Project',
                        name: 'project',
                        description: 'Activity related to classic projects.'
                    },
                    {
                        label: 'Project Card',
                        name: 'project_card',
                        description: 'Activity related to cards in a classic project.'
                    },
                    {
                        label: 'Project Column',
                        name: 'project_column',
                        description: 'Activity related to columns in a classic project. '
                    },
                    {
                        label: 'Projects V2 Item',
                        name: 'projects_v2_item',
                        description: 'Activity related to items in a project.'
                    },
                    {
                        label: 'Public',
                        name: 'public',
                        description: 'When a private repository is made public.'
                    },
                    {
                        label: 'Pull Request',
                        name: 'pull_request',
                        description: 'Activity related to pull requests.'
                    },
                    {
                        label: 'Pull Request Review',
                        name: 'pull_request_review',
                        description: 'Activity related to pull request reviews.'
                    },
                    {
                        label: 'Pull Request Review Comment',
                        name: 'pull_request_review_comment',
                        description: 'Activity related to pull request review comments in the pull request unified diff.'
                    },
                    {
                        label: 'Pull Request Review Thread',
                        name: 'pull_request_review_thread',
                        description: 'Activity related to a comment thread on a pull request being marked as resolved or unresolved.'
                    },
                    {
                        label: 'Push',
                        name: 'push',
                        description: 'Activity related to one or more commits pushed to a repository branch or tag.'
                    },
                    {
                        label: 'Release',
                        name: 'release',
                        description: 'Activity related to a release.'
                    },
                    {
                        label: 'Repository Dispatch',
                        name: 'repository_dispatch',
                        description: 'This event occurs when a GitHub App sends a POST request to the "Create a repository dispatch event" endpoint.'
                    },
                    {
                        label: 'Repository',
                        name: 'repository',
                        description: 'Activity related to a repository.'
                    },
                    {
                        label: 'Repository Import',
                        name: 'repository_import',
                        description: 'Activity related to a repository being imported to GitHub.'
                    },
                    {
                        label: 'Repository Vulnerability Alert',
                        name: 'repository_vulnerability_alert',
                        description: 'Activity related to security vulnerability alerts in a repository.'
                    },
                    {
                        label: 'Security Advisory',
                        name: 'security_advisory',
                        description: 'Activity related to a security advisory that has been reviewed by GitHub. A GitHub-reviewed security advisory provides information about security-related vulnerabilities in software on GitHub.'
                    },
                    {
                        label: 'Sponsorship',
                        name: 'sponsorship',
                        description: 'Activity related to a sponsorship listing. The type of activity is specified in the action property of the payload object.'
                    },
                    {
                        label: 'Star',
                        name: 'star',
                        description: 'Activity related to a repository being starred.'
                    },
                    {
                        label: 'Status',
                        name: 'status',
                        description: 'When the status of a Git commit changes.'
                    },
                    {
                        label: 'Team',
                        name: 'team',
                        description: 'Activity related to an organization team.'
                    },
                    {
                        label: 'Team Add',
                        name: 'team_add',
                        description: 'When a repository is added to a team.'
                    },
                    {
                        label: 'Watch',
                        name: 'watch',
                        description: 'When someone stars a repository.'
                    },
                    {
                        label: 'Workflow Dispatch',
                        name: 'workflow_dispatch',
                        description: 'This event occurs when someone triggers a workflow run on GitHub or sends a POST request to the "Create a workflow dispatch event" endpoint.'
                    },
                    {
                        label: 'Workflow Job',
                        name: 'workflow_job',
                        description: 'A GitHub Actions workflow job has been queued, is in progress, or has been completed on a repository.'
                    },
                    {
                        label: 'Workflow Run',
                        name: 'workflow_run',
                        description: 'When a GitHub Actions workflow run is requested or completed.'
                    }
                ],
                default: 'push'
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
                description: 'The account owner of the repository. The name is not case sensitive.'
            },
            {
                label: 'Repository',
                name: 'repo',
                type: 'string',
                description: 'The name of the repository. The name is not case sensitive.'
            }
        ];
    }
    async runWebhook(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const req = nodeData.req;
        if (inputParametersData === undefined) {
            throw new Error('Required data missing');
        }
        if (req === undefined) {
            throw new Error('Missing request');
        }
        // Check if it is a ping event, if yes return null
        if (req.headers && req.headers['x-github-event'] === 'ping')
            return null;
        const returnData = [];
        returnData.push({
            headers: req === null || req === void 0 ? void 0 : req.headers,
            params: req === null || req === void 0 ? void 0 : req.params,
            query: req === null || req === void 0 ? void 0 : req.query,
            body: req === null || req === void 0 ? void 0 : req.body,
            rawBody: req.rawBody,
            url: req === null || req === void 0 ? void 0 : req.url
        });
        return (0, utils_1.returnWebhookNodeExecutionData)(returnData);
    }
}
module.exports = { nodeClass: GitHubWebhook };
//# sourceMappingURL=GitHubWebhook.js.map