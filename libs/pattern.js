const bem = require('bem-naming');
const get = require('lodash.get');

const ELEMDELIM = '__';
const MODDELIM = '_';

function getRootPath(levels) {

    if ( typeof levels === 'string' ) {
        return levels;
    }

    return ( levels.length === 1 )
        ? levels[ 0 ]
        : `{${levels.join()}}`;
}

module.exports = function getPattern(entity, levels, exts, opts) {

    const elemDelim = get(opts, 'elemDelim', ELEMDELIM);
    const modDelim = get(opts, 'modDelim', MODDELIM);
    const root = getRootPath(levels);
    const baseName = bem.stringify(entity);

    let pattern;
    switch ( bem.typeOf(entity) ) {
        case 'block':
            pattern = `${root}/${entity.block}/${baseName}\.{${exts.join()}}`;
            break;
        case 'elem':
            pattern = `${root}/${entity.block}/{\.,${elemDelim}${entity.elem}}/${baseName}\.{${exts.join()}}`;
            break;
        case 'blockMod':
            pattern = `${root}/${entity.block}/{\.,${modDelim}${entity.mod}}/${baseName}\.{${exts.join()}}`;
            break;
        case 'elemMod':
            pattern = `${root}/${entity.block}/{\.,${elemDelim}${entity.elem}}/{\.,${modDelim}${entity.mod}}/${baseName}\.{${exts.join()}}`;
            break;
    }

    return pattern;
};
