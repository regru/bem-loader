const createNaming = require('bem-naming');
const get = require('lodash.get');

const ELEMDELIM = '__';
const MODDELIM = '_';
const EXTS = [ 'js', 'css' ];

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
