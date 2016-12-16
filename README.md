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
