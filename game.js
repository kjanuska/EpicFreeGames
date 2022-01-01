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

  get begin_unix() {
    return this.unix(this._begin);
  }

  get end_unix() {
    return this.unix(this._end);
  }

  get next() {
    // add 30 minutes to the date time to allow for slow updates on Epic's part
    let date = new Date(this._end);
    date.setMinutes(date.getMinutes() + 30);
    return date;
  }
}
