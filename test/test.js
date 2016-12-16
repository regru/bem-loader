const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const sinon = require('sinon');

const loader = require('../');
const bemdecl = require('../fixtures/bem/bundles/all/all.bemdecl');


describe('bem-loader', function() {

    const context = {
        exec: function(source) {
            const module = {
                exports: {}
            };

            eval(source);

            return module.exports;
        },
        async: function() { },
        query: {},
        resourceQuery: {},
        options: {
            context: path.resolve(__dirname, '../', 'fixtures'),
            bem: {
                levels: [
                    path.resolve(__dirname, '../', 'fixtures/bem','blocks')
                ],
                extensions: [
                    'deps.js',
                    'less',
                    'js',
                ]
            }
        }
    };

    let spy;

    before(function(done) {
        spy = sinon.spy(done);
        context.async = function() {
            return spy;
        };

        loader.call( context, bemdecl );
    });

    it('should resolve *.bemdecl.js', function() {

        const args = spy.args[0];
        expect(args[ 0 ]).to.be.null; //error

        expect(args[ 1 ]).to.match( /b-block-one\.js/ );
        expect(args[ 1 ]).to.match( /b-block-one__elem\.js/ );
        expect(args[ 1 ]).to.match( /b-block-two\.js/ );
        expect(args[ 1 ]).to.match( /b-block-two__elem\.js/ );
    });

    it('should search elems inside block and elem path', function() {

        const args = spy.args[0];
        expect(args[ 0 ]).to.be.null; //error

        expect(args[ 1 ]).to.match( /b-block-one\.js/ );
        expect(args[ 1 ]).to.match( /__elem\/b-block-one__elem\.js/ );
        expect(args[ 1 ]).to.match( /b-block-two\.js/ );
        expect(args[ 1 ]).to.match( /\/b-block-two__elem\.js/ );
    });
});
