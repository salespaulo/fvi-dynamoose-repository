'use strict'

const { env } = require('fvi-node-utils')

const newModelNameNotFound = (debugPrefix, modelName) => {
    const e = new Error(`${debugPrefix}: Not Found Model ${modelName}`)
    e.name = 'DynamooseModelNameNotFoundError'
    return e
}

module.exports = {
    APP_PREFIX: '[dynamoose][repository]',
    DYNAMO_PORT: 8000,
    DYNAMO_LOCAL: !env.IS_PROD,
    newModelNameNotFound,
}
