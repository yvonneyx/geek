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

  get value() {
    return new Float64Array(this.memory)[0];
  }

  toString() {}

  toNumber() {
    return this;
  }

  toBoolean() {
    if (new Float64Array(this.memory)[0] === 0) {
      return new JSBoolean(false);
    } else {
      return new JSBoolean(true);
    }
  }
}

export class JSString extends JSValue {
  constructor(characters) {
    super();
    // this.memory = new ArrayBuffer(characters.length * 2);
    this.characters = characters;
  }

  toString() {
    return this;
  }

  toNumber() {}

  toBoolean() {
    if (new Float64Array(this.memory)[0] === 0) {
      return new JSBoolean(false);
    } else {
      return new JSBoolean(true);
    }
  }
}

export class JSBoolean extends JSValue {
  constructor(value) {
    super();
    this.value = value || false;
  }

  toString() {
    if (this.value) {
      return new JSString(["t", "r", "u", "e"]);
    } else {
      return new JSString(["f", "a", "l", "s", "e"]);
    }
  }
  toNumber() {
    if (this.value) {
      return new JSNumber(1);
    } else {
      return new JSNumber(0);
    }
  }
  toBoolean() {
    return this;
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

export class JSNull extends JSValue {
  toString() {
    return new JSString(["n", "u", "l", "l"]);
  }
  toNumber() {
    return new JSNumber(0);
  }
  toBoolean() {
    return new JSBoolean(false);
  }
}

export class JSUndefined extends JSValue {
  toString() {
    return new JSString(["u", "n", "d", "e", "f", "i", "n", "e", "d"]);
  }
  toNumber() {
    return new JSNumber(NaN);
  }
  toBoolean() {
    return new JSBoolean(false);
  }
}

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

// 语句完成后的记录 type: normal,break,continue,return,throw
export class CompletionRecord {
  constructor(type, value, target) {
    this.type = type || "normal";
    this.value = value || new JSUndefined();
    this.target = target || null;
  }
}
