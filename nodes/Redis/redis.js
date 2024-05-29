"use strict";

const { createClient } = require('redis');

class Redis {
    constructor() {
        this.loadMethods = {};
        this.label = 'Redis';
        this.name = 'redis';
        this.icon = 'https://www.svgrepo.com/show/303460/redis-logo.svg';
        this.type = 'action';
        this.category = 'Database';
        this.version = 1.0;
        this.description = 'Execute Redis operations';
        this.incoming = 1;
        this.outgoing = 1;
        this.actions = [
            {
                label: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    { label: 'Delete', name: 'delete' },
                    { label: 'Get', name: 'get' },
                    { label: 'Set', name: 'set' },
                    { label: 'Increment', name: 'incr' },
                    { label: 'Keys', name: 'keys' },
                    { label: 'Publish', name: 'publish' },
                    { label: 'Push', name: 'push' },
                    { label: 'Pop', name: 'pop' }
                ]
            }
        ];
        this.credentials = [
            {
                label: 'Host',
                name: 'host',
                type: 'string',
                default: 'localhost',
                placeholder: 'Enter your Redis host',
                description: 'Redis host to connect to.'
            },
            {
                label: 'Port',
                name: 'port',
                type: 'number',
                default: 6379,
                placeholder: 'Enter your Redis port',
                description: 'Redis port to connect to.'
            },
            {
                label: 'Password',
                name: 'password',
                type: 'string',
                default: '',
                placeholder: 'Enter your Redis password (if any)',
                description: 'Password for Redis authentication.'
            }
        ];
        this.inputParameters = [
            {
                label: 'Key',
                name: 'key',
                type: 'string',
                show: { 'actions.operation': ['delete', 'get', 'set', 'incr'] },
                required: true
            },
            {
                label: 'Value',
                name: 'value',
                type: 'string',
                show: { 'actions.operation': ['set'] },
                required: true
            },
            {
                label: 'Key Pattern',
                name: 'keyPattern',
                type: 'string',
                show: { 'actions.operation': ['keys'] },
                required: true
            },
            {
                label: 'Channel',
                name: 'channel',
                type: 'string',
                show: { 'actions.operation': ['publish'] },
                required: true
            },
            {
                label: 'Message Data',
                name: 'messageData',
                type: 'string',
                show: { 'actions.operation': ['publish', 'push'] },
                required: true
            },
            {
                label: 'List',
                name: 'list',
                type: 'string',
                show: { 'actions.operation': ['push', 'pop'] },
                required: true
            },
            {
                label: 'Tail',
                name: 'tail',
                type: 'boolean',
                default: false,
                show: { 'actions.operation': ['push', 'pop'] }
            },
            {
                label: 'Property Name',
                name: 'propertyName',
                type: 'string',
                default: 'propertyName',
                show: { 'actions.operation': ['get', 'pop'] }
            },
            {
                label: 'Expire',
                name: 'expire',
                type: 'boolean',
                default: false,
                show: { 'actions.operation': ['incr'] }
            },
            {
                label: 'TTL',
                name: 'ttl',
                type: 'number',
                default: 60,
                show: { 'inputParameters.expire': [true] }
            }
        ];
    }

    async run(nodeData) {
        const inputParametersData = nodeData.inputParameters;
        const credentials = nodeData.credentials;
        const actionsData = nodeData.actions;

        if (inputParametersData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }
        if (credentials === undefined) {
            throw new Error('Missing credential');
        }

        const returnData = [];
        const operation = actionsData.operation;
        const key = inputParametersData.key;
        const value = inputParametersData.value;
        const keyPattern = inputParametersData.keyPattern;
        const channel = inputParametersData.channel;
        const messageData = inputParametersData.messageData;
        const list = inputParametersData.list;
        const tail = inputParametersData.tail;
        const expire = inputParametersData.expire;
        const ttl = inputParametersData.ttl;
        const propertyName = inputParametersData.propertyName;

        const client = createClient({
            url: `redis://${credentials.host}:${credentials.port}`,
            password: credentials.password || undefined
        });

        await client.connect();

        try {
            let result;

            switch (operation) {
                case 'delete':
                    result = await client.del(key);
                    break;
                case 'get':
                    result = await client.get(key);
                    break;
                case 'set':
                    result = await client.set(key, value);
                    break;
                case 'incr':
                    result = await client.incr(key);
                    if (expire) {
                        await client.expire(key, ttl);
                    }
                    break;
                case 'keys':
                    result = await client.keys(keyPattern);
                    break;
                case 'publish':
                    result = await client.publish(channel, messageData);
                    break;
                case 'push':
                    result = await client[tail ? 'rPush' : 'lPush'](list, messageData);
                    break;
                case 'pop':
                    result = await client[tail ? 'rPop' : 'lPop'](list);
                    break;
                default:
                    throw new Error(`Unsupported operation: ${operation}`);
            }

            if (operation === 'get' || operation === 'pop') {
                returnData.push({ [propertyName]: result });
            } else {
                returnData.push(result);
            }
        } catch (error) {
            throw new Error(`Error executing Redis node: ${error.message}`);
        } finally {
            await client.disconnect();
        }

        return returnData;
    }
}

module.exports = { nodeClass: Redis };
