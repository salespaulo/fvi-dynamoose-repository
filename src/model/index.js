'use strict'

const { string } = require('fvi-node-utils')

const { init } = require('../dynamoose')
const defaultCrud = require('./default-crud')

const execCreateOrUpdate = (model, execGet, execCreate, execUpdate) => async (key, obj) => {
    const data = await execGet(model, key)

    if (data) {
        delete data.createdAt
        delete data.updatedAt

        const objKeys = Object.keys(obj)
        const dataKeys = Object.keys(data)

        dataKeys.forEach(k => {
            const exists = objKeys.find(okey => k === okey)

            if (!exists) {
                obj[k] = data[k]
            }
        })

        return execUpdate(model, key, obj)
    } else {
        return execCreate(model, obj)
    }
}

const createModel = (config, instance) => (modelName, modelSchema, schemaOpts = {}, opts = {}) => {
    const { query, scan, execGet, execCreate, execDelete, execUpdate } = defaultCrud(config)

    const slugModelName = string.slugify(modelName)
    const model = instance.setup(slugModelName, modelSchema, schemaOpts, opts)

    return {
        name: slugModelName,
        query: query(model),
        scan: scan(model),
        get: key => execGet(model, key),
        create: obj => execCreate(model, obj),
        delete: key => execDelete(model, key),
        update: execCreateOrUpdate(model, execGet, execCreate, execUpdate),
    }
}

module.exports = config => {
    const instance = init(config)

    return {
        create: createModel(config, instance),
        server: instance.server,
    }
}
