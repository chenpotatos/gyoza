export function isFileNameSafe(fileName) {
  // 正则表达式匹配中文字符、小写字母、数字和连字符
  return /^[a-zA-Z0-9\u4e00-\u9fa5]+(-[a-zA-Z0-9\u4e00-\u9fa5]+)*$/.test(fileName)
}
