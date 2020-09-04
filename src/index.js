'use strict'

const { debug, objects } = require('fvi-node-utils')
const { APP_PREFIX, newModelNameNotFound } = require('./utils')

const dynamoose = require('./dynamoose')

const MODELS = {}

const get = modelName => {
    const instance = MODELS[modelName]

    if (instance == null) {
        throw newModelNameNotFound(`${APP_PREFIX}[get]`, modelName)
    }

    return instance
}

const closeFactory = instance => {
    return () =>
        instance.server.close(e => {
            // Closing server error
            if (e) {
                const error = objects.toErrorStack(e, log => {
                    debug.here(`${APP_PREFIX}[close]: Close error=${log}`)
                })

                return error
            }

            debug.here(`${APP_PREFIX}[close]: Closed Server!`)
        })
}

const mapFactory = instance => (modelName, modelSchema, schemaOpts = {}, opts = {}) => {
    const model = instance.model(modelName, modelSchema, schemaOpts, opts)
    MODELS[modelName] = model

    return {
        get: get,
        map: mapFactory(instance),
        close: closeFactory(instance),
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
    const instance = dynamoose(config)
    const repository = {
        // Get model
        get: get,
        // Map model
        map: mapFactory(instance),
        // Close dynamo
        close: closeFactory(instance),
    }

    process.on('SIGINT', () => {
        debug.here(`${APP_PREFIX}[SIGINT]: Interrupt signal: Closing Repository!`)
        repository.close()
    })

    process.on('SIGTERM', () => {
        debug.here(`${APP_PREFIX}[SIGTERM]: Interrupt signal: Closing Repository!`)
        repository.close()
    })

    return repository
}
