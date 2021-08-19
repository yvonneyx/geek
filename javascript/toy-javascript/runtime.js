export class Realm {
  constructor() {
    this.global = new Map();
    this.Object = new Map();
    this.Object.call = function () {};
    this.Object_prototype = new Map();
  }
}

// number string boolean object null undefined symbol
// 基类
export class JSValue {
  get type() {
    if (this.constructor === JSNumber) {
      return "number";
    }
    if (this.constructor === JSString) {
      return "string";
    }
    if (this.constructor === JSBoolean) {
      return "boolean";
    }
    if (this.constructor === JSObject) {
      return "object";
    }
    if (this.constructor === JSNull) {
      return "null";
    }
    if (this.constructor === JSSymbol) {
      return "symbol";
    }
    return "undefined";
  }
}

export class JSNumber extends JSValue {
  constructor(value) {
    super();
    this.memory = new ArrayBuffer(8);
    if (arguments.length) {
      new Float64Array(this.memory)[0] = value;
    } else {
      new Float64Array(this.memory)[0] = 0;
    }
  }

  get value() {}
}

export class JSString extends JSValue {
  constructor(characters) {
    super();
    // this.memory = new ArrayBuffer(characters.length * 2);
    this.characters = characters;
  }
}

export class JSBoolean extends JSValue {
  constructor(value) {
    super();
    this.value = value || false;
  }
}

export class JSObject extends JSValue {
  constructor(proto) {
    super();
    this.properties = new Map();
    this.prototype = proto || null;
  }

  setProperty(name, attributes) {
    this.properties.set(name, attributes);
  }

  getProperty(name) {
    // TODO
    // return this.properties.get(name);
  }

  setPrototype(proto) {
    this.prototype = proto;
  }

  getPrototype() {
    return this.prototype;
  }
}

export class JSNull extends JSValue {}

export class JSUndefined extends JSValue {}

export class JSSymbol extends JSValue {
  constructor(name) {
    super();
    this.name = name || "";
  }
}

export class EnvironmentRecord {
  constructor() {
    this.thisValue;
    this.variables = new Map();
    this.outer = null;
  }
}

// 运行时用于存储变量
export class ExecutionContext {
  constructor(realm, lexicalEnvironment, variableEnvironment) {
    variableEnvironment = variableEnvironment || lexicalEnvironment;
    this.lexicalEnvironment = lexicalEnvironment;
    this.variableEnvironment = this.lexicalEnvironment;
    this.realm = realm;
  }
}

export class Reference {
  constructor(object, property) {
    this.object = object;
    this.property = property;
  }

  set(value) {
    this.object[this.property] = value;
  }

  get() {
    return this.object[this.property];
  }
}
