import RouteBuilder from "./RouteBuilder";

export default class Request {
  constructor(url) {
    this.url = url;
    this.method = "get";
  }

  get() {
    this.method = "get";
    return this;
  }

  post() {
    this.method = "post";
    return this;
  }

  put() {
    this.method = "put";
    return this;
  }

  delete() {
    this.method = "delete";
    return this;
  }

  body(json) {
    this.json = json;
    return this;
  }

  send() {
    const options = {
      method: this.method,
      headers: { "Content-Type": "application/json" }
    };

    if (this.json) {
      options.body = JSON.stringify(this.json);
    }

    return fetch(RouteBuilder.get(this.url), options);
  }
}
