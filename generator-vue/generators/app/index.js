/*
npm link
yo vue
*/

var Generator = require("yeoman-generator");

Object.assign(
  Generator.prototype,
  require("yeoman-generator/lib/actions/install")
);

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async initPackage() {
    let answer = this.prompt({
      type: "input",
      name: "name",
      message: "Your project name",
      default: this.appname,
    });

    const pkgJson = {
      name: answer.name,
      version: "1.0.0",
      description: "",
      main: "generators/app/index.js",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      author: "",
      license: "ISC",
      devDependencies: {},
      dependencies: {},
    };

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);

    this.npmInstall(["vue"], { "save-dev": false });
    this.npmInstall(
      [
        "webpack",
        "vue-loader",
        "vue-template-compiler",
        "vue-style-loader",
        "css-loader",
        "copy-webpack-plugin",
      ],
      { "save-dev": true }
    );

    this.fs.copyTpl(
      this.templatePath("Hello.vue"),
      this.destinationPath("src/Hello.vue"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: answer.name }
    );
  }
};
