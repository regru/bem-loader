const { promisify } = require('util');
const { lstat } = require('fs');

const Bluebird = require('bluebird');
const glob = require('glob');

const Block = require('./block');

const lstatAsync = promisify( lstat );
const search = Bluebird.promisify( glob );

module.exports = function( context, entity, options ) {
    if ( !( options.levels && options.levels.length ) ) {
        throw new Error('No levels was set');
    }

    const block = new Block( entity, options );
    const promises = options.levels.map( function( level ) {
        const blockPath = `${level}/${entity.block}`;

        return lstatAsync( `${level}/${entity.block}` )
            .then( function( stat ) {
                if ( stat.isDirectory() ) {
                    return blockPath;
                }

                return false;
            } )
            .catch( function() {
                return false;
            } );
    } );

    const emitMethod  = options.strict ? 'emitError' : 'emitWarning';

    return Bluebird.filter( promises, res => res )
        .spread( function( directory ) {
            if ( !directory ) {
                context[emitMethod]( `Entity ${block.toString()} not found` );

                return [];
            }

            return search( `${directory}/${block.toGlobPattern()}` );
        } )
        .then( function( matches ) {
            if ( !matches.length ) {
                context[emitMethod]( `No files found for ${block.toString()}` );

                return [];
            }

            return matches
                .sort( function( a, b ) {
                    if ( /\.deps\.js$/.test( b ) ) {
                        return 1;
                    }

                    return 0;
                } );
        } );
};
