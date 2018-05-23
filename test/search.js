const path = require('path');

const search = require('../libs/search');
const expect = require('chai').expect;
const sinon = require('sinon');

const block = {
    block : 'b-block-two',
};
const levels = [
    path.resolve( __dirname, 'fixtures/bem','blocks' ),
    path.resolve( __dirname, 'fixtures/bem','blocks.duplicated' ),
];
const duplicateFirstLevels = [
    path.resolve( __dirname, 'fixtures/bem','blocks.duplicated' ),
    path.resolve( __dirname, 'fixtures/bem','blocks' ),
];
const extensions = [
    'deps.js', 'js', 'css',
];
const context = {
    emitWarning() {},
};

describe( 'search', function() {
    let spy;

    beforeEach( function() {
        spy = sinon.spy( context , 'emitWarning' );

    } );

    afterEach( function() {
        context.emitWarning.restore();
    } );

    it( 'should emit warning if found nothing', function() {
        return search( context, { block: 'nonexistent' }, { levels } )
            .then( function() {
                expect( spy.called ).to.be.true;
            } );
    } );

    it( 'should throw exception if levels not set', function() {
        expect( () => search( context, block ) ).to.throw();
    } );

    it( 'should return absolute path for block\'s files', function() {
        return search( context, block, {
            levels,
            extensions,
        } ).then( function( results ) {
            expect( results.length ).to.be.equal( 1 );
            expect( results ).to.include( path.join( __dirname, 'fixtures/bem/blocks/b-block-two/b-block-two.js' ) );
        } );
    } );

    it( 'should return first occurrence', function() {
        return search( context, block, {
            levels : duplicateFirstLevels,
            extensions,
        } ).then( function( results ) {
            expect( results.length ).to.be.equal( 2 );
            expect( results ).to.include(
                path.join(
                    __dirname,
                    'fixtures/bem/blocks.duplicated/b-block-two/b-block-two.deps.js'
                )
            );
            expect( results ).to.include(
                path.join(
                    __dirname,
                    'fixtures/bem/blocks.duplicated/b-block-two/b-block-two.js'
                )
            );
        } );
    } );

    it( '.deps file should always be first', function() {
        return search( context, block, {
            levels : duplicateFirstLevels,
            extensions,
        } ).then( function( results ) {
            expect( results.length ).to.be.equal( 2 );
            expect( results[ 0 ] ).be.equal(
                path.join(
                    __dirname,
                    'fixtures/bem/blocks.duplicated/b-block-two/b-block-two.deps.js'
                )
            );
        } );
    } );
} );
