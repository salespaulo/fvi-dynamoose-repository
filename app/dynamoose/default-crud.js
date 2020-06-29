'use strict'

const { debug, sugar, objects } = require('fvi-node-utils')
const { APP_PREFIX } = require('../utils')

const LIMIT = 100
const DEBUG_PREFIX = `${APP_PREFIX}[default-crud]`

const removeNullProps = obj => {
    return sugar.Object.filter(obj, val => val != null)
}

const buildQueryByObject = obj => {
    const queryCreated = {}

    for (let k in obj) {
        queryCreated[k] = { eq: obj[k] }
    }

    debug.here(`${DEBUG_PREFIX}[buildQueryByObject]: obj=${objects.inspect(obj)}`)
    debug.here(`${DEBUG_PREFIX}[buildQueryByObject]: query=${objects.inspect(queryCreated)}`)
    return queryCreated
}

const queryGetOneFactory = m => key => {
    debug.here(`${DEBUG_PREFIX}[queryGetOne][${m.modelName}]: By key=${objects.inspect(key)}`)
    return m.get(key)
}

const queryByEqualFactory = m => (query, startAt, limit) => {
    debug.here(
        `${DEBUG_PREFIX}[queryByEqual][${m.modelName}]: By query=${objects.inspect(
            query
        )}; startAt=${objects.inspect(startAt)}; limit=${limit}`
    )
    const queryEqual = m.query(buildQueryByObject(query))

    if (startAt != null) {
        queryEqual.startAt(startAt)
    }

    if (limit != null) {
        queryEqual.limit(limit)
    }

    return queryEqual.exec()
}

const scanAllFactory = m => (startAt = null, limit = LIMIT) => {
    debug.here(
        `${DEBUG_PREFIX}[scanAll][${m.modelName}]: By startAt=${objects.inspect(
            startAt
        )}; limit=${limit}`
    )

    const queryScan = m.scan()

    if (startAt != null) {
        queryScan.startAt(startAt)
    }

    if (limit != null) {
        queryScan.limit(limit)
    }

    return queryScan.exec()
}

const createFactory = m => obj => {
    const objWithoutNulls = removeNullProps(obj)
    debug.here(`${DEBUG_PREFIX}[create][${m.modelName}]: By obj=${objects.inspect(obj)}`)
    debug.here(
        `${DEBUG_PREFIX}[create][${m.modelName}]: By without nulls obj=${objects.inspect(
            objWithoutNulls
        )}`
    )
    return m.create(objWithoutNulls)
}

const updateFactory = m => async (key, obj) => {
    const objWithoutNulls = removeNullProps(obj)
    debug.here(
        `${DEBUG_PREFIX}[update][${m.modelName}]: By key=${objects.inspect(
            key
        )}; obj=${objects.inspect(obj)}`
    )
    debug.here(
        `${DEBUG_PREFIX}[update][${m.modelName}]: By key=${objects.inspect(
            key
        )}; obj=${objects.inspect(objWithoutNulls)}`
    )

    await m.update(key, objWithoutNulls)
    return queryGetOneFactory(m)(key)
}

const deleteFactory = m => async key => {
    debug.here(`${DEBUG_PREFIX}[delete][${m.modelName}]: By Key=${objects.inspect(key)}`)
    const data = await queryGetOneFactory(m)(key)
    await m.delete(key, { update: true })
    return data
}

const queryFactory = m => {
    return {
        from: m.query,
        equals: queryByEqualFactory(m),
        getOne: queryGetOneFactory(m),
    }
}

const scanFactory = m => {
    return {
        from: m.scan,
        all: scanAllFactory(m),
    }
}

module.exports = model => {
    return {
        name: model.modelName,
        query: queryFactory(model),
        scan: scanFactory(model),
        create: createFactory(model),
        update: updateFactory(model),
        delete: deleteFactory(model),
    }
}
