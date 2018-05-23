const loaderUtils = require('loader-utils');
const flatten = require('lodash.flatten');
const exec = require('webpack-loader-api-exec');

const utils = require('./libs');

module.exports = function( source ) {

    if ( this.cacheable ) {
        this.cacheable();
    }

    const options = loaderUtils.getOptions( this );
    const content = ( typeof source === 'string' )
        ? exec( source, this.resourcePath )
        : source;

    const next = this.async();

    const modules = utils.normalize( content );

    Promise.all( modules.map( ( block ) => utils.search( block, options.bem ) ) )
        .then( ( pathes ) => {
            const result = [];

            for ( let path of flatten( pathes ) ) {
                if ( !path ) {
                    continue;
                }

                const req = loaderUtils.stringifyRequest( this, path );

                result.push( `require(${req});` );
            }

            next( null, result.join('\n') );
        } )
        .catch( ( err ) => {

            if ( typeof err === 'string' ) {
                this.emitWarning( err );

                return void next( null );
            }

            next( err );
        } );
};
