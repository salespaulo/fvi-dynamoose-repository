'use strict'

const utils = require('fvi-node-utils')

const LIMIT = 100

const removeEmptyProps = obj => {
    return utils.sugar.Object.filter(
        obj,
        val => val != null && (val.length != null ? val.length > 0 : false)
    )
}

const createQuery = query => {
    const queryCreated = {}

    for (let k in query) {
        queryCreated[k] = { eq: query[k] }
    }

    utils.debug.here(`[Dynamoose Query]: ${utils.objects.inspect(queryCreated)}`)
    return queryCreated
}

/**
 * Query all items from query object parameter using equals
 * conditional, e.g.:
 * Query Parameter:
 * {
 *      id: '1234'
 * }
 * Query Generated:
 * {
 *      id: {
 *          eq: '1234'
 *      }
 * }
 * Returns lastKey when exists more items to query.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execQuery = (m, query, startKey, limit) => {
    utils.debug.here(
        `[Dynamoose ${m['name']}]: DynamoDB Query Equals: ${utils.objects.inspect(query)}`
    )

    return new Promise((res, rej) => {
        let q = m.query(createQuery(query)).limit(limit)

        if (startKey) {
            utils.debug.here(
                `[Dynamoose ${m['name']}]: DynamoDB Query StartAt: ${utils.objects.inspect(
                    startKey
                )}`
            )
            q = q.startAt(startKey)
        }

        return q.exec((err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Scan all items from model and returns it.
 * Returns lastKey when exists more items to scan.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execScan = (m, startKey, limit) => {
    utils.debug.here(`[Dynamoose ${m['name']}]: DynamoDB Scan`)

    return new Promise((res, rej) => {
        let scan = m.scan()

        if (startKey) {
            utils.debug.here(
                `[Dynamoose ${m['name']}]: DynamoDB Scan StartAt: ${utils.objects.inspect(
                    startKey
                )}`
            )
            scan = scan.startAt(startKey)
        }

        return scan.limit(limit).exec((err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Get one item from hash key and returns it or null if
 * not exists.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execGet = (m, key) => {
    utils.debug.here(`[Dynamoose ${m['name']}]: DynamoDB Get Key: ${utils.objects.inspect(key)}`)

    return new Promise((res, rej) => {
        return m.get(key, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Delete one item from hash key and returns it or error.
 * @param {Model} m Dynamoose Model
 * @param {Object} key Hash Key
 */
const execDelete = (m, key) => {
    utils.debug.here(`[Dynamoose ${m['name']}]: DynamoDB Delete Key: ${utils.objects.inspect(key)}`)

    return new Promise((res, rej) => {
        return m.delete(key, { update: true }, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Create one item from Object and returns it or error.
 * @param {Model} m Dynamoose Model
 * @param {Object} obj Object based model schema.
 */
const execCreate = (m, obj) => {
    utils.debug.here(`[Dynamoose ${m['name']}]: DynamoDB Create: ${utils.objects.inspect(obj)}`)

    return new Promise((res, rej) => {
        return m.create(removeEmptyProps(obj), (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Update one item from Key and Object and returns it or error.
 * @param {Model} m Dynamoose Model
 * @param {Object} obj Object based model schema.
 */
const execUpdate = (m, key, obj) => {
    utils.debug.here(`[Dynamoose ${m['name']}]: DynamoDB Update: ${utils.objects.inspect(obj)}`)

    return new Promise((res, rej) => {
        return m.update(key, removeEmptyProps(obj), (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

/**
 * Query Object contains:
 * - from: Returns Dynamoose Query object.
 * - equals: Execute Query Equals from query parameter pass
 */
const query = m => {
    return {
        from: m.query,
        equals: (query, startKey = false, limit = LIMIT) => execQuery(m, query, startKey, limit),
    }
}

/**
 * Scan Object contains:
 * - from: Returns Dynamoose Scan object.
 * - equals: Execute Query Equals from query parameter pass
 */
const scan = m => {
    return {
        from: m.scan,
        all: (startKey = false, limit = LIMIT) => execScan(m, startKey, limit),
    }
}

module.exports = config => {
    return {
        query,
        scan,
        execGet,
        execCreate,
        execDelete,
        execUpdate,
    }
}
