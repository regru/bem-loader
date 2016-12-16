const loaderUtils = require('loader-utils');
const flatten = require('lodash.flatten');

const utils = require('./libs');

module.exports = function(source) {

    const content = (typeof source === 'string')
        ? this.exec( source, this.resourcePath )
        : source;

    const next = this.async();

    const query = loaderUtils.parseQuery(this.query);
    const resourceQuery = loaderUtils.parseQuery(this.resourceQuery);
    const params = Object.assign(this.options.bem || {}, resourceQuery, query);

    const modules = utils.normalize(content);

    Promise.all( modules.map( (block) => utils.search(this, block, params.levels, params.extensions) ) )
        .then((pathes) => {
            const result = [];

            for( let path of flatten(pathes) ) {
                if (!path) {
                    continue;
                }

                result.push( `require(${loaderUtils.stringifyRequest( this, path )});` );
            }

            next( null, result.join('\n') );
        })
        .catch(function(err) {
            next(err);
        });
};
