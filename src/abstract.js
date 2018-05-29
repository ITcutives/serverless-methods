/**
 * Created by ashish on 29/05/2018.
 */
class Abstract {
  constructor(request, response, env, token) {
    this.request = request;
    this.response = response;
    this.env = env;
    this.token = token;
    this.parentPath = token.rootDir;
  }

  async handle() {
    return Promise.resolve(this.response.respond(200, this.request));
  }
}

module.exports = Abstract;
