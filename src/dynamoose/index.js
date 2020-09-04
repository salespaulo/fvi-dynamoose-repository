'use strict'

const dynamoose = require('dynamoose')

const { debug, string, sugar, objects } = require('fvi-node-utils')

const defaultCrud = require('./default-crud')
const { APP_PREFIX, DYNAMO_PORT, DYNAMO_LOCAL } = require('../utils')

const DEBUG_PREFIX = `${APP_PREFIX}[dynamo]`

const schemaModel = objects.joi.object({
    modelName: objects.joi.string().required(),
})

const modelFactory = config => (modelName, modelSchema, schemaOpts = {}, opts = {}) => {
    debug.here(`${DEBUG_PREFIX}[model]: Setup ${modelName}`)

    const checks = schemaModel.validate({ modelName })

    if (checks.error) {
        throw new Error(
            `${DEBUG_PREFIX}[model]: Invalid input schema error=${objects.inspect(error)}`
        )
    }

    const slugModelName = string.slugify(modelName)
    const schema = new dynamoose.Schema(modelSchema, schemaOpts)
    const options = objects.merge(config.options, opts)
    const model = dynamoose.model(slugModelName, schema, options)

    // TODO:
    debug.here(
        `${DEBUG_PREFIX}[model]: Setup By ${objects.inspect({
            slugModelName,
            modelSchema,
            schemaOpts,
        })}; opts: ${objects.inspect(options)}`
    )

    model.modelName = modelName

    return defaultCrud(model)
}

const getServer = isDynalite => {
    if (!isDynalite) {
        return { close: () => {} }
    }

    debug.here(`${DEBUG_PREFIX}[dynalite]: Creating on port=${DYNAMO_PORT}`)

    const dynalite = require('dynalite')
    const server = dynalite()
    server.listen(DYNAMO_PORT)

    debug.here(
        `${DEBUG_PREFIX}[dynalite]: Created on port=${DYNAMO_PORT}; server=${
            server != null ? 'OK' : 'FAIL'
        }`
    )

    return server
}

const configure = config => {
    const cfgDefault = {
        prefix: config.prefix != null ? config.prefix : '',
        suffix: config.suffix != null ? config.suffix : '',
        ...config.options,
    }

    debug.here(`${DEBUG_PREFIX}[defaults]: Configure by ${objects.inspect(cfgDefault)}`)
    dynamoose.model.defaults.set(cfgDefault)

    const accessKeyId = DYNAMO_LOCAL ? 'accessKey' : config.accessKeyId
    const secretAccessKey = DYNAMO_LOCAL ? 'secretKey' : config.secretAccessKey
    const region = DYNAMO_LOCAL ? 'us-east-1' : config.region

    const awsConfig = { accessKeyId, secretAccessKey, region }

    dynamoose.aws.sdk.config.update(awsConfig)
    debug.here(`${DEBUG_PREFIX}[aws]: Configure by ${objects.inspect(awsConfig)}`)

    if (DYNAMO_LOCAL) {
        dynamoose.aws.ddb.local()
        debug.here(`${DEBUG_PREFIX}[local]: Configure Local DynamoDB url=http://localhost:3000`)
        console.log(`[WARN]${DEBUG_PREFIX}: Configure Local DynamoDB url=http://localhost:3000`)
    }

    return { ...cfgDefault, awsConfig }
}

module.exports = config => {
    debug.here(`${DEBUG_PREFIX}: Connecting By ${objects.inspect(config)}`)

    const isDynalite = DYNAMO_LOCAL && config.dynalite
    const configured = configure(config)

    debug.here(`${DEBUG_PREFIX}: Connected By ${objects.inspect({ ...configured, isDynalite })}`)

    return {
        model: modelFactory(config),
        server: getServer(isDynalite),
    }
}
