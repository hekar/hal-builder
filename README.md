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
  .addAction('find-widget', Hal.action()
    .setTitle('Find Widget')
    .setMethod('GET')
    .setHref('https://api.example.org/widgets/search')
    .setType('application/x-www-form-urlencoded')
    .addField('q', Hal.field()
      .setType('text')))
  .addLink('self', Hal.link()
    .setHref('https://api.example.org/'));

const siren = entity.toJSON();

// siren = {
//   class: ['home'],
//   properties: {
//     version: '2.4.1',
//     health: 'green'
//   },
//   actions: [
//     {
//       name: 'find-widget',
//       method: 'GET',
//       href: 'https://api.example.org/widgets/search',
//       title: 'Find Widget',
//       type: 'application/x-www-form-urlencoded',
//       fields: [
//         {
//           name: 'q',
//           type: 'text'
//         }
//       ]
//     }
//   ],
//   links: [
//     {
//       rel: ['self'],
//       href: 'https://api.example.org/'
//     }
//   ]
// }
```

## Installation

```sh
$ npm install -S hal-builder
```

