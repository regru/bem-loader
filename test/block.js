const expect = require('chai').expect;

const Block = require('../libs/block');

const block = {
    block : 'b-block-one',
};
const blockElem = {
    block : 'b-block-one',
    elem  : 'elem',
};
const blockMod = {
    block   : 'b-block-one',
    modName : 'mod',
};
const elemMod = {
    block   : 'b-block-one',
    elem    : 'elem',
    modName : 'mod',
};
const nonStandartNotation = {
    elemDelim : '~~',
    modDelim  : '~',
};

describe( 'Block', function() {
    describe( 'constructor', function() {
        it( 'should use yandex notation by default', function() {
            const bemBlock = new Block( blockElem );

            expect( bemBlock.toString() ).to.be.equal('b-block-one__elem');
        } );

        it( 'should use notation passed with options', function() {
            const bemBlock = new Block( blockElem, {
                elemDelim : nonStandartNotation.elemDelim,
                modDelim  : nonStandartNotation.modDelim,
            } );

            expect( bemBlock.toString() ).to.be.equal('b-block-one~~elem');
        } );
    } );

    describe( 'toGlobPattern', function() {
        it( 'block', function() {
            const bemBlock = new Block( block );

            expect( bemBlock.toGlobPattern() ).to.be.equal('b-block-one.{js,css}');
        } );

        it( 'blockElem', function() {
            const bemBlock = new Block( blockElem );

            expect( bemBlock.toGlobPattern() ).to.be.equal('{.,__elem}/b-block-one__elem.{js,css}');
        } );

        it( 'blockMod', function() {
            const bemBlock = new Block( blockMod );

            expect( bemBlock.toGlobPattern() ).to.be.equal('{.,_mod}/b-block-one_mod.{js,css}');
        } );

        it( 'elemMod', function() {
            const bemBlock = new Block( elemMod );

            expect( bemBlock.toGlobPattern() )
                .to.be.equal('{.,__elem}/{.,_mod}/b-block-one__elem_mod.{js,css}');
        } );
    } );
} );
