const bem = require('bem-naming');
const glob = require('glob');
const get = require('lodash.get');

const ELEMDELIM = '__';
const MODDELIM = '_';

module.exports = function(context, entity, options) {

    const elemDelimiter = get(options, 'elemDelimiter', ELEMDELIM);
    const modDelimiter = get(options, 'modDelimiter', MODDELIM);

    return new Promise(function(resolve, reject) {

        const pattern = require('./pattern')( entity, options );

        new glob.Glob(pattern, {}, function(err, matches) {


            if (err) {
                return reject(err);
            }

            if (!matches.length) {
                context.emitWarning(`Entity ${bem.stringify(entity)} not found`);

                resolve([]);

                return;
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
