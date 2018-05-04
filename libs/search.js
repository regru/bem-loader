const bem = require('bem-naming');
const glob = require('glob');
const get = require('lodash.get');
const path = require('path');

const ELEMDELIM = '__';
const MODDELIM = '_';

// Removes duplicating bem blocks - leaves only first occurences
function deduplicateMatches(matches) {
    const firstOccurences = {};

    return matches.reduce((dedupArr, filepath) => {
        const filename = path.basename(filepath);

        if ( !(filename in firstOccurences) ) {
            firstOccurences[filename] = true;
            dedupArr.push(filepath);
        }

        return dedupArr;
    }, []);
}

module.exports = function(context, entity, options) {

    const elemDelimiter = get(options, 'elemDelimiter', ELEMDELIM);
    const modDelimiter = get(options, 'modDelimiter', MODDELIM);

    return new Promise(function(resolve, reject) {

        const pattern = require('./pattern')( entity, options );

        new glob.Glob(pattern, { nosort: true, nounique: true }, function(err, matches) {
            const deduplicated = deduplicateMatches(matches);

            if (err) {
                return reject(err);
            }

            if (!deduplicated.length) {
                context.emitWarning(`Entity ${bem.stringify(entity)} not found`);

                resolve([]);

                return;
            }

            deduplicated.sort(function(a, b) {

                if ( /\.deps\.js$/.test(b) ) {
                    return 1;
                }

                return 0;
            });

            resolve( deduplicated );
        });
    });
};
