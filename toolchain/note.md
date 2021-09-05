# 初始化与构建

## 初始化工具 Yeoman

Generators 是 Yeoman 生态系统的一部分，它们是通过 yo 命令为最终用户生成文件的插件。

## [Getting Started](https://yeoman.io/authoring/index.html)

### 1. Setting up as a node module

- 创建新的模块 `npm init`
- 模块上安装 Yeoman `npm install yeoman-generator`

```JSON
{
  "name": "generator-name",
  "version": "0.1.0",
  "description": "",
  "files": [
    "generators"
  ],
  "keywords": ["yeoman-generator"],
  "dependencies": {
    "yeoman-generator": "^1.0.0"
  }
}
```

### 2. 根据 Yeoman 文档创建目录结构 Folder tree

```
├───package.json
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
```

### 3. Extending generator

```js
var Generator = require("yeoman-generator");

module.exports = class extends Generator {};
```

- Overwriting the constructor

```js
module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag
  }
};
```

- Adding your own functionality

```js
module.exports = class extends Generator {
  method1() {
    this.log("method 1 just ran");
  }

  method2() {
    this.log("method 2 just ran");
  }
};
```

:::tip Tips
Yeoman 会顺次执行 Class 中的所有方法
:::

4. Running the generator

- `npm link`会将本地模块 link 到 npm 标准的模块里面去
- 运行 yo 命令需要全局安装 `npm install -g yo`
- `yo toolchain` 直接运行

## [User Interactions](https://yeoman.io/authoring/user-interactions.html)

Yeoman 提供了用命令行与用户交互的功能，其中`this.prompt`用于用户输入，`this.log`用于输出。

```js
module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?",
      },
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }
};
```

```log
zhuyuxindeMBP-2:toolchain cyrine$ yo toolchain
? Your project name demo
? Would you like to enable the Cool feature? No
app name demo
cool feature false

No change to package.json was detected. No package manager install will be executed.
```

## [Interacting with the file system](https://yeoman.io/authoring/file-system.html)

重要功能：文件模版系统

1. 首先创建`./templates/`
2. 编写 Generator`index.js`

```js
 writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
```

3. 创建一个新的空的实例文件夹

```log
zhuyuxindeMBP-2:geek cyrine$ mkdir toolchain-demo
zhuyuxindeMBP-2:geek cyrine$ cd toolchain-demo/
zhuyuxindeMBP-2:toolchain-demo cyrine$ yo toolchain
```

## [Managing Dependencies](https://yeoman.io/authoring/dependencies.html)

依赖系统，对 npm 有个简单的封装

```js
class extends Generator {
  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }
};
```

:::tip Tip
yeoman-generator 在 5.0 后默认不携带 install，需要自己安装，https://github.com/yeoman/generator/releases/tag/v5.0.0，
添加 Object.assign(Generator.prototype, require('yeoman-generator/lib/actions/install')) 这一句可解决

```js
var Generator = require("yeoman-generator");
Object.assign(
  Generator.prototype,
  require("yeoman-generator/lib/actions/install")
);
```

:::
