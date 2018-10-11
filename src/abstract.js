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

  getClassConstructor(name) {
    return require(`${this.token.rootDir}/models/${name}`);
  }

  async handle() {
    return this.response.respond(200, this.request);
  }
}

module.exports = Abstract;
