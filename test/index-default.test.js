'use strict'

const chai = require('chai')
const uuid = require('uuid')

const utils = require('fvi-node-utils')
const repositoryUtils = require('fvi-dynamoose-utils')

const app = require('../src')

const schemaTests = {
    id: repositoryUtils.hashKeyString(),
    client: repositoryUtils.rangeKeyString(),
    status: repositoryUtils.globalIndexString('status-index', 'client'),
    type: repositoryUtils.globalIndexString('type-index', 'client'),
}

const schemaOpts = {
    saveUnknown: true,
}

describe('Testing:', () => {
    it('Testing app - OK:', done => {
        chai.assert.isFunction(app, 'app is not a function')
        done()
    })

    describe(`Testing repository`, () => {
        it(`Testing Repository create - OK`, done => {
            app()
            done()
        })

        it('Testing Repository OK:', done => {
            const repo = app()
            chai.assert.isFunction(repo.get, 'repo.get is not a function!')
            chai.assert.isFunction(repo.map, 'repo.map is not a function!')
            chai.assert.isFunction(repo.close, 'repo.close is not a function!')
            done()
        })
    })

    describe(`Testing model`, () => {
        const id = uuid.v4()
        const client = 'Intelligir'
        const status = 'STATUS'
        const type = 'TYPE'
        let repository = null
        let model = null

        before(() => {
            repository = app()
            const x = repository.map('Tests Default 1', schemaTests, schemaOpts)
            model = x.get('Tests Default 1')
        })

        after(() => {
            repository.close()
        })

        it('Testing Repository with Error', done => {
            try {
                repository.map(null, null, null)
                done('Should be throws Error!')
            } catch (e) {
                done()
            }
        })

        it('Testing Create OK:', done => {
            model
                .create({ id: id + '3', client, type, status })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(!!res.id, 'Not Found Response.id!')
                    chai.assert(!!res.status, 'Not Found Response.status!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Create OK:', done => {
            model
                .create({ id, client, status, type, attr: 'test' })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(!!res.id, 'Not Found Response.id!')
                    chai.assert(!!res.status, 'Not Found Response.status!')
                    chai.assert(!!res.type, 'Not Found Response.type!')
                    chai.assert(!!res.attr, 'Not Found Response.attr!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Create OK:', done => {
            model
                .create({ id: id + '2', client, status, type, attr: 'test_2' })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(!!res.id, 'Not Found Response.id!')
                    chai.assert(!!res.status, 'Not Found Response.status!')
                    chai.assert(!!res.type, 'Not Found Response.type!')
                    chai.assert(!!res.attr, 'Not Found Response.attr!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Get One:', done => {
            model.query
                .getOne({ id, client })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(!!res.id, 'Not Found Response.id!')
                    chai.assert(!!res.status, 'Not Found Response.status!')
                    chai.assert(!!res.type, 'Not Found Response.type!')
                    chai.assert(!!res.attr, 'Not Found Response.attr!')
                    done()
                })
                .catch(done)
        })

        it('Testing Get Empty:', done => {
            model.query
                .getOne({ id: 'NotFound', client })
                .then(res => {
                    chai.assert(!res, 'Found Response where Id no exists!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Get One:', done => {
            model.query
                .getOne({ id, client })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(!!res.id, 'Not Found Response.id!')
                    chai.assert(!!res.status, 'Not Found Response.status!')
                    chai.assert(!!res.type, 'Not Found Response.type!')
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

        it('Testing Scan attr=test:', done => {
            model.scan
                .from('attr')
                .eq('test')
                .exec()
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(res.count > 0, 'Response.count === 0!')
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

        it('Testing Query Status Equals:', done => {
            model.query
                .equals({ status, client })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(res.count > 0, 'Response.count <= 0!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Query Type Equals:', done => {
            model.query
                .equals({ type, client })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(res.count > 0, 'Response.count <= 0!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Query Status and Type Equals:', done => {
            model.query
                .equals({ status, client, type })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(res.count > 0, 'Response.count <= 0!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Query Status and Type Not Found:', done => {
            model.query
                .equals({ status: 'NotFound', client, type })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(res.count == 0, 'Response.count != 0!')
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

        it('Testing Status Query Dynamoose:', done => {
            model.query
                .from('status')
                .eq(status)
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

        it('Testing Status Query Equals Limit 1:', done => {
            model.query
                .equals({ status, client }, false, 1)
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(res.count === 1, 'Response.count != 1!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it(`Testing Update id=${id + '2'} Update attr=test2 OK:`, done => {
            model
                .update({ id: id + '2', client }, { status, type, attr: 'test2' })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(!!res.id, 'Not Found Response.id!')
                    chai.assert(!!res.status, 'Not Found Response.status!')
                    chai.assert(!!res.attr, 'Not Found Response.attr!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it(`Testing Update id=${id + '3'} New attr=test OK:`, done => {
            model
                .update({ id: id + '3', client }, { status, type, attr: 'test_' })
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(!!res.id, 'Not Found Response.id!')
                    chai.assert(!!res.status, 'Not Found Response.status!')
                    chai.assert(!!res.attr, 'Not Found Response.attr!')
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
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })

        it('Testing Scan attr=test_:', done => {
            model.scan
                .from('attr')
                .contains('test_')
                .exec()
                .then(res => {
                    chai.assert(!!res, 'Not Found Response!')
                    chai.assert(res.count > 0, 'Response.count == 0!')
                    done()
                })
                .catch(err => {
                    done('Exception:' + utils.objects.inspect(err))
                })
        })
    })
})
