
/**
 * 把被打包资源过滤掉
 */
module.exports = function(options, modified, total, callback) {
  var ignore = options.ignore || [];

  if (typeof ignore === 'string') {
    ignore = ignore.split(/[\s,]+/);
  } else if (ignore && !Array.isArray(ignore)) {
    ignore = [ignore];
  }

  ignore = ignore && ignore.map(function(str) {
    return fis.util.glob(str);
  });

  var isIgnored = function(path) {
    if (!ignore) {
      return false;
    }

    var allPassed = ignore.every(function(pattern) {
      if (pattern.test(path)) {
        return false;
      }

      return true;
    });

    return !allPassed;
  }

  var skipFile = function(options,arrFile){
    var i = arrFile.length - 1;
    var file;
    while ((file = arrFile[i--])) {
      if (file.map && (
          options.skipPackedToPkg && file.map.pkg ||
          options.skipPackedToAIO && file.map.aioPkg ||
          options.skipPackedToCssSprite && file.map.cssspritePkg)) {

        //检查如果文件被pack之后，packTo的文件就是该文件，是不能被skip掉的
        if(typeof file.packTo === 'string' 
           && file.packTo === file.subpath){
          continue;
        }

        // 检查是否 ignore 了
        if (ignore && isIgnored(file.subpath)) {
          continue;
        }

        arrFile.splice(i + 1, 1);
      }
    }

  }

  skipFile(options,modified);
  skipFile(options,total);

  callback();
};

module.exports.options = {
  skipPackedToPkg: true,
  skipPackedToAIO: true,
  skipPackedToCssSprite: true,
  ignore: null
  // ignore: ['/src/**']
};
