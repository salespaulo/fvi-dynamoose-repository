'use strict'

const utils = require('fvi-node-utils')

const model = require('./model')

const models = {}

const mapModel = model => (modelName, modelSchema, schemaOpts = {}, opts = {}) => {
    const instance = model.create(modelName, modelSchema, schemaOpts, opts)

    // setup model pool
    models[`${modelName}`] = instance

    return {
        map: mapModel(model),
        get: getModel,
    }
}

const getModel = modelName => {
    const instance = models[`${modelName}`]

    if (!instance) {
        const e = new Error(`[Dynamoose Model]: Not Found Model name=${modelName}`)
        e.name = 'ModelDynamooseError'
        throw e
    }

    return instance
}

const closeRepository = instance => {
    return () =>
        instance.server.close(e => {
            // Closing server error
            if (e) {
                const error = utils.objects.toErrorStack(e, log => {
                    utils.debug.here(`[Dynamoose Server]: Close error=${log}`)
                })

                return error
            }

            utils.debug.here(`[Dynamoose Server]: Closed Server!`)
        })
}

const repository = modelInstance => {
    return {
        get: getModel,
        map: mapModel(modelInstance),
        close: closeRepository(modelInstance),
    }
}

const getConfig = (cfg = null) => {
    if (cfg == null) {
        const config = require('./config')
        const dynamooseCfg = config.get('dynamoose')

        return dynamooseCfg
    }

    return cfg
}

module.exports = cfg => {
    const config = getConfig(cfg)
    const modelInstance = model(config)
    const repo = repository(modelInstance)

    process.on('SIGINT', () => {
        utils.debug.here('[Dynamoose SIGINT]: Interrupt signal: Closing Repository!')
        repo.close()
    })

    process.on('SIGTERM', () => {
        utils.debug.here('[Dynamoose SIGTERM]: Interrupt signal: Closing Repository!')
        repo.close()
    })

    return repo
}
