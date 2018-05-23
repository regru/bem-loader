const path = require('path');

const search = require('../libs/search');
const expect = require('chai').expect;


const block = {
    block : 'b-block-two',
};
const blockElem = {
    block : 'b-block-two',
    elem  : 'elem',
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

describe( 'search', function() {
    it( 'should be rejected with simple string message if found nothing', function() {
        return search( { block: 'nonexistent' }, { levels } )
            .then( function() {
                throw new Error('Should emit exception');
            } )
            .catch( function( err ) {
                expect( err ).to.be.a('string');
            } );
    } );

    it( 'should throw exception if levels not set', function() {
        expect( () => search( block ) ).to.throw();
    } );

    it( 'should return absolute path for block\'s files', function() {
        return search( block, {
            levels,
            extensions,
        } ).then( function( results ) {
            expect( results.length ).to.be.equal( 1 );
            expect( results ).to.include( path.join( __dirname, 'fixtures/bem/blocks/b-block-two/b-block-two.js' ) );
        } );
    } );

    it( 'should return first occurrence', function() {
        return search( block, {
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
        return search( block, {
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
