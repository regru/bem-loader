// const path = require('path');

const createNaming = require('bem-naming');
const get = require('lodash.get');

const ELEMDELIM = '__';
const MODDELIM = '_';
const EXTS = [ 'js', 'css' ];

// function getRootPath( levels ) {
//
//     validateLevels( levels );
//
//     if ( typeof levels === 'string' ) {
//         return levels;
//     }
//
//     return ( levels.length === 1 )
//         ? levels[ 0 ]
//         : `{${levels.join()}}`;
// }
//
// function checkIfLevelsIsAbsolute( levels ) {
//
//     for ( let level of levels ) {
//         if ( !path.isAbsolute( level ) ) {
//             throw new Error('`levels` should be setted as absolute path');
//         }
//     }
// }
//
// function validateLevels( levels ) {
//     if ( !levels ) {
//         throw new Error('You should provide `levels` via options');
//     }
//
//     if ( typeof levels === 'string' ) {
//         checkIfLevelsIsAbsolute( [ levels ] );
//     }
//
//     checkIfLevelsIsAbsolute( levels );
// }

module.exports = class {
    constructor( entity, opts ) {

        this._delims = {
            elem : get( opts, 'elemDelim', ELEMDELIM ),
            mod  : {
                name : get( opts, 'modDelim', MODDELIM ),
                val  : get( opts, 'modDelim', MODDELIM ),
            },
        };

        this._entity = entity;
        this._exts = get( opts, 'extensions', EXTS );
    }

    toGlobPattern() {
        const bem = createNaming( this._delims );
        const baseName = bem.stringify( this._entity );

        let pattern;

        switch ( bem.typeOf( this._entity ) ) {
            case 'block':
                pattern = '';
                break;
            case 'elem':
                pattern = `{.,${this._delims.elem}${this._entity.elem}}`;

                break;
            case 'blockMod':
                pattern = `{.,${this._delims.mod.name}${this._entity.modName}}`;

                break;
            case 'elemMod':
                pattern = `{.,${this._delims.elem}${this._entity.elem}}/`
                    + `{.,${this._delims.mod.name}${this._entity.modName}}`;

                break;
            default:
                throw new Error('Wrong bem format');
        }

        return pattern
            ? `${pattern}/${baseName}.{${this._exts.join()}}`
            : `${baseName}.{${this._exts.join()}}`;
    }

    toString() {
        const bem = createNaming( this._delims );

        return bem.stringify( this._entity );
    }
};
