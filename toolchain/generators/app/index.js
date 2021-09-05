var Generator = require("yeoman-generator");

Object.assign(Generator.prototype, require('yeoman-generator/lib/actions/install')) 

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  /* User Interactions

  async method1() {
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
  */

  /* Interacting with the file system

  async writing() {
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("public/index.html"),
      { title: "Templating with Yeoman" }
    );
  }
  */

  /* Managing Dependencies */

  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: "^3.15.0",
      },
      dependencies: {
        react: "^16.2.0",
      },
    };

    // Extend or create package.json file in destination path
	this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
	
	this.npmInstall();
  }

};
