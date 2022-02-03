export class BearerToken {
  static #STORAGE_KEY = 'rms-token';
  constructor(id, token) {
    this.id = id;
    this.token = token;
    this.state = 'transient';
  }
  static getInstance() {
    const values = localStorage.getItem(BearerToken.#STORAGE_KEY);
    if (!values) {
      //return { id: null };
      return null;
    }
    const { id, token } = JSON.parse(values);
    const instance = new BearerToken(id, token);
    instance.state = 'sync';
    return instance;
  }
  store() {
    localStorage.setItem(
      BearerToken.#STORAGE_KEY,
      JSON.stringify({ id: this.id, token: this.token })
    );
    this.state = 'sync';
  }
  remove() {
    if (this.state !== 'sync') {
      return;
    }
    localStorage.removeItem(BearerToken.#STORAGE_KEY);
    this.state = 'transient';
  }
}
