const bem = require('bem-naming');
const glob = require('glob');
const get = require('lodash.get');

module.exports = function(context, entity, levels, exts) {

    const elemDelimiter = get(context.options, 'bem.elemDelimiter', '__');
    const modDelimiter = get(context.options, 'bem.modDelimiter', '_');

    return new Promise(function(resolve, reject) {

        const pattern = require('./pattern')( entity, levels, exts, get(context.options, 'bem', {}) );
        const options = {};

        new glob.Glob(pattern, options, function(err, matches) {

            if (err) {
                return reject(err);
            }

            matches.sort(function(a, b) {

                if ( /\.deps\.js$/.test(b) ) {
                    return 1;
                }

                return 0;
            });

            resolve( matches );
        });
    });
};
