'use strict'

const { config } = require('fvi-node-utils')
const app = require('../../app')

const cfg = config({
            dynamoose: {
                accessKeyId: {
                    doc: 'AWS Access Key ID',
                    format: String,
                    default: 'accessKeyId',
                    env: 'AWS_ACCESS_KEY_ID',
                    arg: 'aws-access-key-id',
                },
                secretAccessKey: {
                    doc: 'AWS Secret Access Key',
                    format: String,
                    default: 'secretAccessKey',
                    env: 'AWS_SECRET_ACCESS_KEY',
                    arg: 'aws-secret-access-key',
                },
                region: {
                    doc: 'AWS DynamoDB Region',
                    format: String,
                    default: 'mock',
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
                    doc: 'DynamoDB local with dynalite.',
                    format: Boolean,
                    default: false,
                    env: 'DYNAMO_LOCAL_WITH_DYNALITE',
                    arg: 'dynamo-local-with-dynalite',
                },
                options: {
                    doc: 'The dynamoose options.',
                    format: Object,
                    default: {},
                },
            },
        })
 
module.exports = () => app(cfg.get('dynamoose'))
