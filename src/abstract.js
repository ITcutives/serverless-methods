/**
 * Created by ashish on 29/05/2018.
 */
class Abstract {
  constructor(request, response, env, token) {
    this.request = request;
    this.response = response;
    this.env = env;
    this.token = token;
  }

  async searchInDB(ClassConstructor, ids) {
    const condition = [{
      field: 'id',
      operator: 'in',
      value: ids,
    }];
    // find all records
    const classInstance = this.getClassInstance(ClassConstructor);
    return classInstance.SELECT(condition);
  }

  getClassConstructor(name) {
    return require(`${this.token.rootDir}/models/${name}`);
  }

  async handle() {
    return this.response.respond(200, this.request);
  }

  getClassInstance(ClassConstructor) {
    const classInstance = new ClassConstructor();
    classInstance.setContext(this.request);
    return classInstance;
  }
}

module.exports = Abstract;
