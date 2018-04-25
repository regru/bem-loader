const bem = require('bem-naming');
const glob = require('glob');
const get = require('lodash.get');

const ELEMDELIM = '__';
const MODDELIM = '_';

function dedupMatches(matches) {
    const cleared = [];
    const clearIndexes = {};

    const fileNames = matches.map( path => path.split('/').slice(-1)[0] );

    fileNames.forEach((name, i) => {
        if ( !(name in clearIndexes) ) {
            clearIndexes[name] = i;
        }
    });

    for (let filename in clearIndexes) {
        cleared.push(clearIndexes[filename]);
    }

    return cleared.sort().map(idx => matches[idx]);
}

module.exports = function(context, entity, options) {

    const elemDelimiter = get(options, 'elemDelimiter', ELEMDELIM);
    const modDelimiter = get(options, 'modDelimiter', MODDELIM);

    return new Promise(function(resolve, reject) {

        const pattern = require('./pattern')( entity, options );

        new glob.Glob(pattern, {}, function(err, matches) {

            matches = dedupMatches(matches);

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
