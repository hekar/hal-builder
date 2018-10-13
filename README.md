# hal-builder

A fluent [Hal hypermedia](http://stateless.co/hal_specification.html) representation builder.

Based on [Siren Builder](https://github.com/ppaskaris/node-siren-builder).

## Limitations

- Does not include support for curies, as I have not found a use case for such feature support

## Oddities

- Has the notion of "actions" from Siren, which maybe removed from this library pending a major version release

```js
const Hal = require('hal-builder');

const entity = Hal.entity()
  .addClass('home')
  .addProperty('version', '2.4.1')
  .addProperty('health', 'green')
  .addLink('self', Hal.link()
    .setHref('https://api.example.org/'));

const hal = entity.toJSON();

// ...

```

## Installation

```sh
$ npm install -S hal-builder
```

