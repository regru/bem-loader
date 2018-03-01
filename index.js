const loaderUtils = require('loader-utils');
const flatten = require('lodash.flatten');

const utils = require('./libs');

module.exports = function(source) {

    if (this.cacheable) {
        this.cacheable();
    }

    const options = loaderUtils.getOptions(this);
    const content = (typeof source === 'string')
        ? this.exec( source, this.resourcePath )
        : source;

    const next = this.async();

    const modules = utils.normalize(content);

    Promise.all( modules.map( (block) => utils.search( this, block, options.bem ) ) )
        .then((pathes) => {
            const result = [];

            for( let path of flatten(pathes) ) {
                if (!path) {
                    continue;
                }

                const req = loaderUtils.stringifyRequest( this, path );

                result.push( `require(${req});` );
            }

            next( null, result.join('\n') );
        })
        .catch(function(err) {
            next(err);
        });
};
