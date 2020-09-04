'use strict'

const chai = require('chai')
const uuid = require('uuid/v4')

const utils = require('fvi-node-utils')
const repositoryUtils = require('fvi-dynamoose-utils')

const app = require('../src')

const schemaTests = {
    // tenant-id
    id: repositoryUtils.hashKeyString(),
    client: repositoryUtils.rangeKeyString(),
    type: repositoryUtils.globalIndexString('type-index', 'client'),
    name: repositoryUtils.globalIndexString('name-index', 'client'),
}

const schemaOpts = {
    saveUnknown: true,
}

describe('Testing 3 - Hash, Range, Index and By Index:', () => {
    // tenant-id
    const id = 'id'
    const client = 'client'
    const type = 'Type'
    const name = 'Name'
    let repository = null
    let model = null

    before(async () => {
        repository = app()
        model = repository.map('Tests3', schemaTests, schemaOpts).get('Tests3')

        const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
        const promises = ids.map(id => {
            const obj = { id: uuid() + id, client, type, name, attr: '123' }
            return model.create(obj)
        })

        try {
            await Promise.all(promises)
        } catch (e) {
            console.error(e)
            throw e
        }
    })

    after(() => {
        repository.close()
    })

    it('Testing Create OK:', done => {
        model
            .create({ id, client, type, name, attr: '123' })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.client, 'Not Found Response.client!')
                chai.assert(!!res.type, 'Not Found Response.type!')
                chai.assert(!!res.name, 'Not Found Response.name!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Get OK:', done => {
        model.query
            .getOne({ id, client })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.client, 'Not Found Response.client!')
                chai.assert(!!res.type, 'Not Found Response.type!')
                chai.assert(!!res.name, 'Not Found Response.name!')
                chai.assert(!!res.attr, 'Not Found Response.attr!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Scan OK:', done => {
        model.scan
            .all()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Scan Limit 1 OK:', done => {
        model.scan
            .all(null, 1)
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count === 1, 'Response.count != 1!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Query Id Equals:', done => {
        model.query
            .equals({ id, client })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Id Query Dynamoose:', done => {
        model.query
            .from('id')
            .eq(id)
            .and()
            .where('client')
            .eq(client)
            .exec()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Name Query Dynamoose:', done => {
        model.query
            .from('name')
            .eq(name)
            .and()
            .where('client')
            .eq(client)
            .exec()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Type Query Dynamoose:', done => {
        model.query
            .from('type')
            .eq(type)
            .and()
            .where('client')
            .eq(client)
            .exec()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Type Query With Limit Dynamoose:', done => {
        model.query
            .from('type')
            .eq(type)
            .and()
            .where('client')
            .eq(client)
            .limit(2)
            .exec()
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count > 0, 'Response.count <= 0!')
                chai.assert(!!res.lastKey, 'Not Found lastKey!')
                chai.assert(!!res.lastKey.client, 'Not Found lastKey.client!')
                chai.assert(!!res.lastKey.type, 'Not Found lastKey.type!')
                chai.assert(!!res.lastKey.id, 'Not Found lastKey.id!')

                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Name Query Equals Limit 1:', done => {
        model.query
            .equals({ name, client }, false, 1)
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(res.count === 1, 'Response.count != 1!')
                done()
            })
            .catch(err => {
                done('Exception:' + utils.objects.inspect(err))
            })
    })

    it('Testing Delete OK:', done => {
        model
            .delete({ id, client })
            .then(res => {
                chai.assert(!!res, 'Not Found Response!')
                chai.assert(!!res.id, 'Not Found Response.id!')
                chai.assert(!!res.client, 'Not Found Response.client!')
                chai.assert(!!res.type, 'Not Found Response.type!')
                chai.assert(!!res.name, 'Not Found Response.name!')
                done()
            })
            .catch(done)
    })
})
