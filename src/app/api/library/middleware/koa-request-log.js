/*
 * Add logs for requests call/end via the common controller app logger
 */
import Counter from 'passthrough-counter';
import humanize from 'humanize-number';
import bytes from 'bytes';

// @todo disable logger for some ressoures types (statics and so on)
// @see https://github.com/koajs/examples/blob/master/conditional-middleware/index.js

export default function *(next) {
  let start = new Date();

  if(!this.logger) {
    console.info('koa-request-log is enable but has no logger to output data');
  }

  if(this.logger) {
    this.logger.verbose('↓↓↓ %s %s', this.method, this.url);
  }

  yield next;

  if(this.logger) {
    let length = this.response.length;
    let body = this.body;
    let counter;
    if (null == length && body && body.readable) {
      this.body = body
        .pipe(counter = new Counter())
        .on('error', this.onerror);
    }

    if(counter) {
      length = counter.length;
    }

    let duration = new Date() - start;
    duration = duration < 10000 ? duration + 'ms'  : Math.round(duration / 1000) + 's';
    duration = humanize(duration);

    length = length ? bytes(length) : '0';

    this.res.once('finish', () => {
      this.logger.verbose('↑↑↑ [%s] %s - %s (length: %s, duration: %s)', this.method, this.url, this.status, length, duration);
    });
  }
}
