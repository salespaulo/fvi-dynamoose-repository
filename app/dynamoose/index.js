'use strict'

const dynamoose = require('dynamoose')
const dynalite = require('dynalite')

const utils = require('fvi-node-utils')

const getLocalServer = isDynalite => {
    if (!isDynalite) {
        return { close: () => {} }
    }

    const server = dynalite()
    const port = 8000
    server.listen(port)

    utils.debug.here(`[Dynamoose Init]: Server Dynalite Created on port=${port}!`)
    return server
}

const setup = config => (modelName, modelSchema, schemaOpts = {}, opts = {}) => {
    if (!modelName) {
        throw new Error(`Model name is null!`)
    }

    const schema = new dynamoose.Schema(modelSchema, schemaOpts)

    const configOpts = config.options
    configOpts.waitForActive = true

    const options = utils.objects.merge(opts, configOpts)

    utils.debug.here(`[Dynamoose Model]: Model Setup ${modelName}`)
    utils.debug.here(
        `[Dynamoose Model]: Model Setup ${utils.objects.inspect({
            modelSchema,
            schemaOpts,
        })}; opts: ${utils.objects.inspect(options)}`
    )

    return dynamoose.model(modelName, schema, options)
}

const init = config => {
    const defaultConfig = {
        prefix: config.prefix,
        suffix: config.suffix,
        ...config.options,
    }

    utils.debug.here(`[Dynamoose Init]: Default config=${utils.objects.inspect(defaultConfig)}`)

    dynamoose.setDefaults(defaultConfig)

    const isLocal = !utils.env.IS_PROD

    if (isLocal) {
        dynamoose.AWS.config.update({
            accessKeyId: 'accessKeyId',
            secretAccessKey: 'secretAccessKey',
            region: 'us-east-1',
        })

        dynamoose.local()
        utils.debug.here(`[Dynamoose Init]: Setup DynamoDB Local!`)
        console.log(`#WARN# [Dynamoose Init]: Setup Dynamo DB Local!`)

        return {
            setup: setup(config),
            server: getLocalServer(config.dynalite),
        }
    }

    const accessKeyId = config.accessKeyId
    const secretAccessKey = config.secretAccessKey
    const region = config.region

    const awsConfig = { accessKeyId, secretAccessKey, region }

    dynamoose.AWS.config.update(awsConfig)
    utils.debug.here(
        `[Dynamoose Config]: Setup AWS DynamoDB config=${utils.objects.inspect(awsConfig)}`
    )

    return {
        setup: setup(config),
        server: { close: () => {} },
    }
}

module.exports = {
    init,
}
