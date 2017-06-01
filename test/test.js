const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const sinon = require('sinon');

const bem = require('bem-naming');
const loader = require('../');
const bemdecl = require('../fixtures/bem/bundles/all/all.bemdecl');
const bemdecl2 = require('../fixtures/bem/bundles/nonexists/nonexists.bemdecl');


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
        addDependency: function() { },
        emitWarning: function() { },
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
                    'css',
                    'js',
                ]
            }
        }
    };

    describe('normal flow', function() {
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

        it('deps file should always be first', function() {

            const args = spy.args[0];

            expect(args[ 1 ].split('\n')[ 0 ]).to.match( /b-block-one\.deps\.js/ );
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

    describe('wrong flow', function() {
        let async;
        let emitWarning;

        before(function(done) {
            async = sinon.spy(done);
            emitWarning = sinon.spy(context, 'emitWarning');
            context.async = function() {
                return async;
            };

            loader.call( context, bemdecl2 );
        });

        it('should emit warning if block not found' , function() {
            const args = async.args[0];
            const firstCall = {
                block: 'b-block-two',
                elem: 'nonexist'
            };
            const secondCall = {
                block: 'b-nonexist',
            };

            expect(args[ 0 ]).to.be.null; //error
            expect(emitWarning.called).to.be.true;
            expect(emitWarning.withArgs(`Entity ${bem.stringify(firstCall)} not found`).called).to.be.true;
            expect(emitWarning.withArgs(`Entity ${bem.stringify(secondCall)} not found`).called).to.be.true;
        });
    });
});
