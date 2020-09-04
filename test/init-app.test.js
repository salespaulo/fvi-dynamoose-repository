'use strict'

describe('Initialization app', () => {
    it('Testing Init with config into directory', done => {
        try {
            const test = require('../src')
            test()
            done()
        } catch (e) {
            done(e)
        }
    })
})
