const FormData = require('form-data');
const request = require('request-promise-native');

// file = GraphQL Upload type "file" variable
const uploadGraphqlFile = async ({ id, file, logger, url }) => {
  logger.info('[%s] await "file" start', id);
  const { createReadStream, filename, mimetype } = await file;
  logger.info('[%s] await "file" complete: filename: %s', id, filename);

  const form = new FormData();
  form.append('file', createReadStream(), {
    filename,
    contentType: mimetype
  });
  /*
   */

  /*
   * The 'request' library supports passing in form data as a hash. However,
   * when attempting that approach, the streams from the GraphQL Upload types
   * were not being read correctly.  Something about the way the 'request'
   * library sets up the underlying 'FormData' instance was resulting in not
   * reading the streams correctly. It is specific to these kinds of streams,
   * where their content length is not known, as opposed to file streams,
   * which _did_ seem to work.
   *
   * Using the FormData class directly and append()ing the fields, and then
   * calling pipe() below, seems to work properly.
   */
  const reqPromise = request({
    method: 'POST',
    url,
    /*
    formData: {
      file: {
        value: createReadStream(),
        options: {
          filename
        }
      }
    }
    */
    headers: form.getHeaders()
  });
  form.pipe(reqPromise);

  logger.info('[%s:%s] upload request start', id, filename);
  const response = await reqPromise;
  logger.info('[%s:%s] upload request end: %o', id, filename, response);
  return JSON.parse(response);
};

module.exports = { uploadGraphqlFile };
