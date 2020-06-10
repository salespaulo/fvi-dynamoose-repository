'use strict'

const { config } = require('fvi-node-utils')

module.exports = config({
    dynamoose: {
        accessKeyId: {
            doc: 'AWS Access Key ID',
            format: String,
            default: '',
            env: 'AWS_ACCESS_KEY_ID',
            arg: 'aws-access-key-id',
        },
        secretAccessKey: {
            doc: 'AWS Secret Access Key',
            format: String,
            default: '',
            env: 'AWS_SECRET_ACCESS_KEY',
            arg: 'aws-secret-access-key',
        },
        region: {
            doc: 'AWS DynamoDB Region',
            format: String,
            default: 'mock-region',
            env: 'AWS_REGION',
            arg: 'aws-region',
        },
        prefix: {
            doc: 'DynamoDB table prefix name.',
            format: String,
            default: '',
            env: 'DYNAMO_TABLE_PREFIX',
            arg: 'dynamo-table-prefix',
        },
        suffix: {
            doc: 'DynamoDB table suffix name.',
            format: String,
            default: '',
            env: 'DYNAMO_TABLE_SUFFIX',
            arg: 'dynamo-table-suffix',
        },
        dynalite: {
            doc: 'DynamoDB local with Dynalite!.',
            format: Boolean,
            default: false,
            env: 'DYNAMO_LOCAL_WITH_DYNALITE',
            arg: 'dynamo-local-with-dynalite',
        },
        options: {
            doc: 'The dynamoose options.',
            default: {
                create: true,
                update: false,
                waitForActive: true,
                serverSideEncriptation: false,
                waitForActiveTimeout: 1000,
            },
            format: val => {
                if (!val) {
                    throw new Error('Dynamoose options is null!')
                }

                if (typeof val.create !== 'boolean') {
                    throw new Error('Dynamoose options.create is null or invalid!')
                }

                if (typeof val.update !== 'boolean') {
                    throw new Error('Dynamoose options.update is null or invalid!')
                }

                if (typeof val.waitForActive !== 'boolean') {
                    throw new Error('Dynamoose options.waitForActive is null or invalid!')
                }

                if (typeof val.waitForActiveTimeout !== 'number' || val.waitForActiveTimeout <= 0) {
                    throw new Error('Dynamoose options.waitForActiveTimeout is null or invalid!')
                }

                if (typeof val.serverSideEncriptation !== 'boolean') {
                    throw new Error('Dynamoose options.serverSideEncriptation is null or invalid!')
                }
            },
        },
    },
})
