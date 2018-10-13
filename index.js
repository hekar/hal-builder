'use strict';

const METHOD = new Set(['GET', 'PUT', 'POST', 'DELETE', 'PATCH']);
const METHOD_LIST = Array.from(METHOD).join(', ');

function ensureArray(value) {
  if (!Array.isArray(value)) {
    return [value];
  } else {
    return value;
  }
}

class HalAction {

  constructor() {
    this._name = undefined;
    this._class = undefined;
    this._method = undefined;
    this._href = undefined;
    this._title = undefined;
    this._type = undefined;
    this._fields = undefined;
  }

  setName(name) {
    this._name = name;
    return this;
  }

  addClass(className) {
    if (this._class == null) {
      this._class = [];
    }
    this._class.push(className);
    return this;
  }

  setMethod(method) {
    if (!METHOD.has(method)) {
      throw new TypeError('methods MUST be one of ' + METHOD_LIST);
    }
    this._method = method;
    return this;
  }

  setHref(href) {
    this._href = href;
    return this;
  }

  setTitle(title) {
    this._title = title;
    return this;
  }

  setType(type) {
    this._type = type;
    return this;
  }

  addField(name, field) {
    if (this._fields == null) {
      this._fields = [];
    }
    for (let i = 0; i < this._fields.length; ++i) {
      if (this._fields[i]._name === name) {
        throw new Error('field name MUST be unique');
      }
    }
    this._fields.push(field.copy().setName(name));
    return this;
  }

  copy() {
    const copy = new HalAction();
    copy._name = this._name;
    copy._class = this._class;
    copy._method = this._method;
    copy._href = this._href;
    copy._title = this._title;
    copy._type = this._type;
    copy._fields = this._fields;
    return copy;
  }

  clone() {
    const clone = new HalAction();
    if (this._name != null) {
      clone._name = this._name;
    }
    if (this._class != null) {
      clone._class = this._class.slice();
    }
    if (this._method != null) {
      clone._method = this._method;
    }
    if (this._href != null) {
      clone._href = this._href;
    }
    if (this._title != null) {
      clone._title = this._title;
    }
    if (this._type != null) {
      clone._type = this._type;
    }
    if (this._fields != null) {
      clone._fields = this._fields
        .map((field) => field.clone());
    }
    return clone;
  }

  toJSON() {
    const json = {};
    if (this._name != null) {
      json.name = this._name;
    } else {
      throw new Error('action MUST have a name');
    }
    if (this._class != null) {
      json.class = this._class;
    }
    if (this._method != null) {
      json.method = this._method;
    }
    if (this._href != null) {
      json.href = this._href;
    } else {
      throw new Error('action MUST have an href');
    }
    if (this._title != null) {
      json.title = this._title;
    }
    if (this._type != null) {
      json.type = this._type;
    }
    if (this._fields != null) {
      json.fields = this._fields
        .map((field) => field.toJSON());
    }
    return json;
  }

  static create() {
    return new HalAction();
  }

}

class HalEntity {

  constructor() {
    this._class = undefined;
    this._rel = undefined;
    this._properties = undefined;
    this._entities = undefined;
    this._actions = undefined;
    this._links = undefined;
  }

  addClass(className) {
    if (this._class == null) {
      this._class = [];
    }
    this._class.push(className);
    return this;
  }

  setRel(rel) {
    this._rel = ensureArray(rel);
    return this;
  }

  addProperty(key, value) {
    if (this._properties == null) {
      this._properties = {};
    }
    this._properties[key] = value;
    return this;
  }

  addProperties(obj) {
    const keys = Object.keys(obj);
    let key;
    for (let i = 0; i < keys.length; ++i) {
      key = keys[i];
      this.addProperty(key, obj[key]);
    }
    return this;
  }

  addEntity(rel, entity) {
    if (this._entities == null) {
      this._entities = [];
    }
    const copied = entity.copy();
    if (entity instanceof HalEntity) {
      copied.setRel(rel);
    }
    this._entities.push(copied);
    return this;
  }

  addAction(name, action) {
    if (this._actions == null) {
      this._actions = [];
    }
    for (let i = 0; i < this._actions.length; ++i) {
      if (this._actions[i]._name === name) {
        throw new Error('action name MUST be unique');
      }
    }
    this._actions.push(action.copy().setName(name));
    return this;
  }

  addLink(rel, link) {
    if (this._links == null) {
      this._links = {};
    }
    this._links[rel] = link.copy();
    return this;
  }

  copy() {
    const copy = new HalEntity();
    copy._class = this._class;
    copy._rel = this._rel;
    copy._properties = this._properties;
    copy._entities = this._entities;
    copy._actions = this._actions;
    copy._links = this._links;
    return copy;
  }

  clone() {
    const clone = new HalEntity();
    if (this._class != null) {
      clone._class = this._class.slice();
    }
    if (this._rel != null) {
      clone._rel = this._rel.slice();
    }
    if (this._properties != null) {
      clone._properties = Object.assign({}, this._properties);
    }
    if (this._entities != null) {
      clone._entities = this._entities
        .map((entity) => entity.clone());
    }
    if (this._actions != null) {
      clone._actions = this._actions
        .map((action) => action.clone());
    }
    if (this._links != null) {
      clone._links = Object.keys(this._links)
        .reduce((acc, key) => {
          acc[key] = this._links[key].clone();
          return acc;
        }, {});
    }
    return clone;
  }

  toJSON() {
    const json = {};
    if (this._class != null) {
      json.class = this._class;
    }
    if (this._rel != null) {
      json.rel = this._rel;
    }
    if (this._properties != null) {
      Object.assign(json, this._properties);
    }
    if (this._entities != null) {
      json._embedded = this._entities
        .map((entity) => entity.toJSON());
    }
    if (this._actions != null) {
      json._actions = this._actions
        .map((action) => action.toJSON());
    }
    if (this._links != null) {
      json._links = Object.keys(this._links)
        .reduce((acc, key) => {
          acc[key] = this._links[key].toJSON();
          return acc;
        }, {});
    }
    return json;
  }

  static create() {
    return new HalEntity();
  }

}

class HalField {

  constructor() {
    this._name = undefined;
    this._class = undefined;
    this._type = undefined;
    this._value = undefined;
    this._title = undefined;
  }

  setName(name) {
    this._name = name;
    return this;
  }

  addClass(className) {
    if (this._class == null) {
      this._class = [];
    }
    this._class.push(className);
    return this;
  }

  setType(type) {
    this._type = type;
    return this;
  }

  setValue(value) {
    this._value = value;
    return this;
  }

  setTitle(title) {
    this._title = title;
    return this;
  }

  copy() {
    const copy = new HalField();
    copy._name = this._name;
    copy._class = this._class;
    copy._type = this._type;
    copy._value = this._value;
    copy._title = this._title;
    return copy;
  }

  clone() {
    const clone = new HalField();
    if (this._name != null) {
      clone._name = this._name;
    }
    if (this._class != null) {
      clone._class = this._class.slice();
    }
    if (this._type != null) {
      clone._type = this._type;
    }
    if (this._value != null) {
      clone._value = this._value;
    }
    if (this._title != null) {
      clone._title = this._title;
    }
    return clone;
  }

  toJSON() {
    const json = {};
    if (this._name != null) {
      json.name = this._name;
    } else {
      throw new Error('field MUST have a name');
    }
    if (this._class != null) {
      json.class = this._class;
    }
    if (this._type != null) {
      json.type = this._type;
    }
    if (this._value != null) {
      json.value = this._value;
    }
    if (this._title != null) {
      json.title = this._title;
    }
    return json;
  }

  static create() {
    return new HalField();
  }

}
class HalLink {

  constructor() {
    this._rel = undefined;
    this._class = undefined;
    this._href = undefined;
    this._title = undefined;
    this._type = undefined;
  }

  addClass(className) {
    if (this._class == null) {
      this._class = [];
    }
    this._class.push(className);
    return this;
  }

  setHref(href) {
    this._href = href;
    return this;
  }

  setTitle(title) {
    this._title = title;
    return this;
  }

  setType(type) {
    this._type = type;
    return this;
  }

  copy() {
    const copy = new HalLink();
    copy._rel = this._rel;
    copy._class = this._class;
    copy._href = this._href;
    copy._title = this._title;
    copy._type = this._type;
    return copy;
  }

  clone() {
    const clone = new HalLink();
    if (this._rel != null) {
      clone._rel = this._rel.slice();
    }
    if (this._class != null) {
      clone._class = this._class.slice();
    }
    if (this._href != null) {
      clone._href = this._href;
    }
    if (this._title != null) {
      clone._title = this._title;
    }
    if (this._type != null) {
      clone._type = this._type;
    }
    return clone;
  }

  toJSON() {
    const json = {};
    if (this._class != null) {
      json.class = this._class;
    }
    if (this._href != null) {
      json.href = this._href;
    } else {
      throw new Error('link MUST have an href');
    }
    if (this._title != null) {
      json.title = this._title;
    }
    if (this._type != null) {
      json.type = this._type;
    }
    return json;
  }

  static create() {
    return new HalLink();
  }

}

exports.action = HalAction.create;
exports.entity = HalEntity.create;
exports.field = HalField.create;
exports.link = HalLink.create;
