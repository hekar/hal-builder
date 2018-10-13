'use strict';

const Hal = require('../');
const Tap = require('tap');

Tap.test('HalAction', (t) => {

  const incomplete = Hal.action();
  t.throws(() => {
    incomplete.toJSON();
  });

  incomplete.setName('test');
  t.throws(() => {
    incomplete.toJSON();
  });

  incomplete.setHref('test');
  t.doesNotThrow(() => {
    incomplete.toJSON();
  });

  t.throws(() => {
    incomplete.setMethod('TRACE');
  });

  const conflict = Hal.action()
    .addField('duplicate', Hal.field());
  t.throws(() => {
    conflict.addField('duplicate', Hal.field());
  });

  const action = Hal.action()
    .copy()
    .clone()
    .setName('replace-avatar')
    .addClass('upload')
    .setMethod('PUT')
    .setHref('https://api.example.org/users/joe%40example.org/avatar')
    .setTitle('Avatar')
    .setType('image/jpeg')
    .addField('csrf_token', Hal.field()
      .setType('hidden')
      .setValue('MUyFhg+Ah1I5Iz/jbbHwC2Ip/DqCYZFPncFTp9HnTmU='));
  const expected = {
    name: 'replace-avatar',
    class: ['upload'],
    method: 'PUT',
    href: 'https://api.example.org/users/joe%40example.org/avatar',
    title: 'Avatar',
    type: 'image/jpeg',
    fields: [
      {
        name: 'csrf_token',
        type: 'hidden',
        value: 'MUyFhg+Ah1I5Iz/jbbHwC2Ip/DqCYZFPncFTp9HnTmU='
      }
    ]
  };
  t.deepEqual(action.toJSON(), expected);

  const copy = action.copy();
  t.notEqual(copy, action);
  t.deepEqual(copy.toJSON(), action.toJSON());
  copy.addField('krillin', Hal.field());
  copy.addClass('potatos');
  t.deepEqual(copy.toJSON(), action.toJSON());
  copy.setType('image/png');
  t.deepInequal(copy.toJSON(), action.toJSON());

  const clone = action.clone();
  t.notEqual(clone, action);
  t.deepEqual(clone.toJSON(), action.toJSON());
  clone.addField('dog', Hal.field());
  clone.addClass('spaghetti');
  t.deepInequal(clone.toJSON(), action.toJSON());
  action.addField('dog', Hal.field());
  action.addClass('spaghetti');
  t.deepEqual(clone.toJSON(), action.toJSON());
  clone.setType('image/svg+xml');
  t.deepInequal(clone.toJSON(), action.toJSON());

  t.done();
});

Tap.test('HalEntity', (t) => {
  const incomplete = Hal.entity();
  t.deepEqual(incomplete.toJSON(), {});

  const conflict = Hal.entity()
    .addAction('duplicate', Hal.action());
  t.throws(() => {
    conflict.addAction('duplicate', Hal.action());
  });

  const entity = Hal.entity()
    .copy()
    .clone()
    .addClass('home')
    .setRel('help')
    .addProperty('salutation', 'Greetings!')
    .addProperty('hapiness', '7/10')
    .addEntity('next', Hal.entity().addProperty('salutation', 'Hallo!'))
    .addEntity('prev', Hal.link().setHref('https://api.example.org/yo'))
    .addAction('reply', Hal.action()
      .setMethod('POST')
      .setHref('https://api.example.org/reply?salutation=Greetings!')
      .addField('response', Hal.field()
        .setType('text')))
    .addLink('self', Hal.link()
      .setHref('https://api.example.org/greetings'));

  const expected = {
    class: ['home'],
    rel: ['help'],
    salutation: 'Greetings!',
    hapiness: '7/10',
    _embedded: [
      {
        rel: ['next'],
        salutation: 'Hallo!'
      },
      {
        href: 'https://api.example.org/yo'
      }
    ],
    _actions: [
      {
        name: 'reply',
        method: 'POST',
        href: 'https://api.example.org/reply?salutation=Greetings!',
        fields: [
          {
            name: 'response',
            type: 'text'
          }
        ]
      }
    ],
    _links: {
      self: { href: 'https://api.example.org/greetings' }
    }
  };
  t.deepEqual(entity.toJSON(), expected);

  const copy = entity.copy();
  t.notEqual(copy, entity);
  t.deepEqual(copy.toJSON(), entity.toJSON());
  copy.addAction('logout', Hal.action()
    .setHref('https://api.example.org/sign-out'));
  copy.addLink('home', Hal.link()
    .setHref('https://api.example.org'));
  t.deepEqual(copy.toJSON(), entity.toJSON());
  copy.setRel('spooky');
  t.deepInequal(copy.toJSON(), entity.toJSON());

  const clone = entity.clone();
  t.notEqual(clone, entity);
  t.deepEqual(clone.toJSON(), entity.toJSON());
  clone.addAction('sign-out', Hal.action()
    .setHref('https://api.example.org/logout'));
  clone.addLink('raditz', Hal.link()
    .setHref('https://api.example.org'));
  t.deepInequal(clone.toJSON(), entity.toJSON());
  entity.addAction('sign-out', Hal.action()
    .setHref('https://api.example.org/logout'));
  entity.addLink('raditz', Hal.link()
    .setHref('https://api.example.org'));
  t.deepEqual(clone.toJSON(), entity.toJSON());
  clone.setRel('skunk');
  t.deepInequal(clone.toJSON(), entity.toJSON());

  t.done();
});

Tap.test('HalField', (t) => {
  const incomplete = Hal.field();
  t.throws(() => {
    incomplete.toJSON();
  });

  incomplete.setName('test');
  t.doesNotThrow(() => {
    incomplete.toJSON();
  });

  const field = Hal.field()
    .copy()
    .clone()
    .setName('telephone')
    .addClass('required')
    .setType('tel')
    .setValue('+X (XXX) XXX-XXXX')
    .setTitle('International Phone No.');
  const expected = {
    name: 'telephone',
    class: ['required'],
    type: 'tel',
    value: '+X (XXX) XXX-XXXX',
    title: 'International Phone No.'
  };
  t.deepEqual(field.toJSON(), expected);

  const copy = field.copy();
  t.notEqual(copy, field);
  t.deepEqual(copy.toJSON(), field.toJSON());
  copy.addClass('spooky');
  t.deepEqual(copy.toJSON(), field.toJSON());
  copy.setName('phone_number');
  t.deepInequal(copy.toJSON(), field.toJSON());

  const clone = field.clone();
  t.notEqual(clone, field);
  t.deepEqual(clone.toJSON(), field.toJSON());
  clone.addClass('vegeta');
  t.deepInequal(clone.toJSON(), field.toJSON());
  field.addClass('vegeta');
  t.deepEqual(clone.toJSON(), field.toJSON());
  clone.setName('cell');
  t.deepInequal(clone.toJSON(), field.toJSON());

  t.done();
});

Tap.test('HalLink', (t) => {
  const incomplete = Hal.link();
  t.throws(() => {
    incomplete.toJSON();
  });

  t.throws(() => {
    incomplete.toJSON();
  });

  incomplete.setHref('https://api.example.org/about-us');
  t.doesNotThrow(() => {
    incomplete.toJSON();
  });

  const link = Hal.link()
    .copy()
    .clone()
    .addClass('page')
    .setHref('https://api.example.org/items?page=2')
    .setTitle('Page 2')
    .setType('application/vnd.Hal+json');
  const expected = {
    class: ['page'],
    href: 'https://api.example.org/items?page=2',
    title: 'Page 2',
    type: 'application/vnd.Hal+json'
  };
  t.deepEqual(link.toJSON(), expected);

  const copy = link.copy();
  t.notEqual(copy, link);
  t.deepEqual(copy.toJSON(), link.toJSON());
  copy.addClass('spooky');
  t.deepEqual(copy.toJSON(), link.toJSON());
  copy.setTitle('Page Two');
  t.deepInequal(copy.toJSON(), link.toJSON());

  const clone = link.clone();
  t.notEqual(clone, link);
  t.deepEqual(clone.toJSON(), link.toJSON());
  clone.addClass('goku');
  t.deepInequal(clone.toJSON(), link.toJSON());
  link.addClass('goku');
  clone.setTitle('Page II');
  t.deepInequal(clone.toJSON(), link.toJSON());

  t.done();
});

Tap.test('Hal example', (t) => {
  const actual = Hal.entity()
    .addClass('order')
    .addProperty('orderNumber', 42)
    .addProperty('itemCount', 3)
    .addProperty('status', 'pending')
    .addEntity('http://x.io/rels/order-items', Hal.link()
      .addClass('items')
      .addClass('collection')
      .setHref('http://api.x.io/orders/42/items'))
    .addEntity('http://x.io/rels/customer', Hal.entity()
      .addClass('info')
      .addClass('customer')
      .addProperty('customerId', 'pj123')
      .addProperty('name', 'Peter Joseph')
      .addLink('self', Hal.link()
        .setHref('http://api.x.io/customers/pj123')))
    .addAction('add-item', Hal.action()
      .setTitle('Add Item')
      .setMethod('POST')
      .setHref('http://api.x.io/orders/42/items')
      .setType('application/x-www-form-urlencoded')
      .addField('orderNumber', Hal.field()
        .setType('hidden')
        .setValue('42'))
      .addField('productCode', Hal.field()
        .setType('text'))
      .addField('quantity', Hal.field()
        .setType('number')))
    .addLink('self', Hal.link()
      .setHref('http://api.x.io/orders/42'))
    .addLink('previous', Hal.link()
      .setHref('http://api.x.io/orders/41'))
    .addLink('next', Hal.link()
      .setHref('http://api.x.io/orders/43'))
    .toJSON();
  const expected = {
    'class': ['order'],
    'orderNumber': 42,
    'itemCount': 3,
    'status': 'pending',
    '_embedded': [
      {
        'class': ['items', 'collection'],
        'href': 'http://api.x.io/orders/42/items'
      },
      {
        'class': ['info', 'customer'],
        'rel': ['http://x.io/rels/customer'],
        'customerId': 'pj123',
        'name': 'Peter Joseph',
        '_links': {
          self: { 'href': 'http://api.x.io/customers/pj123' }
        }
      }
    ],
    '_actions': [
      {
        'name': 'add-item',
        'title': 'Add Item',
        'method': 'POST',
        'href': 'http://api.x.io/orders/42/items',
        'type': 'application/x-www-form-urlencoded',
        'fields': [
          { 'name': 'orderNumber', 'type': 'hidden', 'value': '42' },
          { 'name': 'productCode', 'type': 'text' },
          { 'name': 'quantity', 'type': 'number' }
        ]
      }
    ],
    '_links': {
      self: { 'href': 'http://api.x.io/orders/42' },
      previous: { 'href': 'http://api.x.io/orders/41' },
      next: { 'href': 'http://api.x.io/orders/43' }
    }
  };
  t.deepEqual(actual, expected);
  t.done();
});

Tap.test('addProperties', (t) => {
  const actual = Hal.entity()
    .addProperty('beforeProp', 'should be kept')
    .addProperty('name', 'will be overridden')
    .addProperties({
      'name': 'overrides previous prop',
      'orderNumber': 42,
      'itemCount': 3,
      'status': 'pending'
    })
    .addProperty('afterProp', 'should be kept')
    .addProperty('status', 'overrides pending')
    .toJSON();
  const expected = {
    orderNumber: 42,
    itemCount: 3,
    status: 'overrides pending',
    name: 'overrides previous prop',
    beforeProp: 'should be kept',
    afterProp: 'should be kept'
  };
  t.deepEqual(actual, expected);
  t.done();
});

Tap.test('readme example', (t) => {
  const actual = Hal.entity()
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
      .setHref('https://api.example.org/'))
    .toJSON();
  const expected = {
    class: ['home'],
    version: '2.4.1',
    health: 'green',
    _actions: [
      {
        name: 'find-widget',
        method: 'GET',
        href: 'https://api.example.org/widgets/search',
        title: 'Find Widget',
        type: 'application/x-www-form-urlencoded',
        fields: [
          {
            name: 'q',
            type: 'text'
          }
        ]
      }
    ],
    _links: {
      self: { href: 'https://api.example.org/' }
    }
  };
  t.deepEqual(actual, expected);
  t.done();
});
