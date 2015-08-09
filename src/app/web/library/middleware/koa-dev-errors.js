import {parse as stackParser} from 'springbokjs-errors';

export default function *(next) {
  try {
    yield next;
  } catch (err) {
    logger.error(stackParser(err).toString());

    // 401 (require auth) and 404 alread managed with redirectOnHtmlStatus
    if(this.status==401 || this.status==404) {
      return next;
    }
    // Else log

    // Display error in development environement
    if(config.display_error) {
      const htmlStackRenderer = new HtmlStackRenderer();
      this.status = 500;
      return this.body=htmlStackRenderer.render(err);
    }
    // Or display an error page for user
    else {
      return next;
    }
  }
}
