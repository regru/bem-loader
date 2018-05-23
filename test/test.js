const { lstat } = require('fs');
const path = require('path');
const { promisify } = require('util');

const expect = require('chai').expect;
const sinon = require('sinon');

const loader = require('../');
const bemdecl = require('./fixtures/bem/bundles/all/all.bemdecl');
const getStat = promisify( lstat );

const FILES = [
    'b-block-one.deps.js',
    'b-block-one.js',
    'b-block-one.css',
    'b-block-one__elem.js',
    'b-block-two.js',
    'b-block-two__elem.js',
];


describe( 'bem-loader', function() {

    const context = {
        async         : function() {},
        addDependency : function() {},
        emitWarning   : function() {},
        query         : {
            context : path.resolve( __dirname, 'fixtures' ),
            bem     : {
                levels : [
                    path.resolve( __dirname, 'fixtures/bem','blocks' ),
                    path.resolve( __dirname, 'fixtures/bem','blocks.duplicated' ),
                ],
                extensions : [
                    'deps.js',
                    'css',
                    'js',
                ],
            },
        },
    };

    let spy;

    beforeEach( function( done ) {
        spy = sinon.spy( done );
        context.async = function() {
            return spy;
        };

        loader.call( context, bemdecl );
    } );

    it( 'should resolve *.bemdecl.js', function() {
        const [ error, result ] = Array.from( spy.args )[0];

        let paths;

        expect( error, `${error}` ).to.be.null;

        paths = result.match( /(?:\/[\d\w.-]+)+/ig );

        expect( paths.length ).to.be.above( 0, 'Empty result' );

        return Promise
            .all(
                paths.map( p_ => {
                    return Promise.all( [ p_, getStat( p_ ) ] );
                } )
            )
            .then( stats => {
                expect( stats.length ).to.equal( FILES.length );

                for ( let [ file, stat ] of stats ) {
                    if ( !stat.isFile() ) {
                        throw new Error( `${file} is not a file` );
                    }

                    expect( path.basename( file ) ).to.be.oneOf( FILES );
                }
            } );
    } );
} );
