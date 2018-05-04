Bem-loader
==========

Yet another webpack loader

### Usage

Configure:

Loader required following params:
```javascript
context: 'path/to/modules/root',
bem: {
    /**
     * levels should be string or array of strings
     */
    levels: [
        'path/to/first/level',
        'path/to/second/level',
        ...,
    ],
    extensions: [
        'deps.js',
        'less',
        'js',
    ],
    elemDelim: '__' // optional, default '__'
    modDelim: '_' //optional, default '_'
},
```

### Warning
If loader will find duplicate bem block in different folders e.g. `path/to/b-block.js` and `different/path/to/b-block.js`
it will use only the first occurences in order of levels array. Look for source in `./libs/search.js`.

