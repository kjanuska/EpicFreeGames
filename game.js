export default class Game {
  constructor(title, image, description, slug, begin, end) {
    this._title = title;
    this._image = image;
    this._description = description;
    this._slug = slug;
    this._begin = new Date(begin);
    this._end = new Date(end);
  }

  get title() {
    return this._title;
  }

  get image() {
    return this._image;
  }

  get description() {
    return this._description;
  }

  get slug() {
    return this._slug;
  }

  unix(date) {
    return Math.floor(date.getTime() / 1000);
  }

  get begin() {
    return this.unix(this._begin);
  }

  get end() {
    return this.unix(this._end);
  }
}
