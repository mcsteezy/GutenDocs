const doctrine = require('doctrine');
const errors = require('./utils/errors.js');

/**
 * @description catchAll descritpiton
 * @param tagArray {[]} catchall param
 * @section parsing function
 * @return catchall return
 */
const processFile = (tagArray) => {
  const tags = {
    content: [],
  };

  tagArray.forEach((x) => {
    const fileObj = doctrine.parse(x.comment, {
      unwrap: true,
    });
    fileObj.name = x.name;
    tags.content.push(fileObj);
  });
  return tags;
};


/**
 * @description A function that will parse a JSdoc Block of Comments using Doctrine
 * @param commentsArray {[]} An array of JSDoc Comment Blocks structured in AST.
 * @param address {string} The path that the file should be saved to.
 * @section section name 2
 * @return n/a
 */
const parseComments = (filesArray) => {
  errors.parseCommentsArrayErr(filesArray);

  const files = [];
  filesArray.forEach((file) => {
    errors.parseCommentsFileErr(file);
    const fileContent = processFile(file.content);
    fileContent.fileName = file.name;
    files.push(fileContent);
  });
  return files;
};

module.exports = parseComments;