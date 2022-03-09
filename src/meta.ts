export const EXT_NAMESPACE = 'i18n-workbench'

export const EXT_ID = 'yzydeveloper.i18n-workbench'

export const PROJECT_ID = 'package.json'

// 中文
export const CHINESE_REGEX = /[\u4E00-\u9FA5]+/gm

// 引号
export const QUOTES_CHARACTER = /(?<="|').*?(?="|')/g

// 模板
export const TEMPLATE_INNER_SYMBOL = /\$\{.*?\}/g

export const TEMPLATE_STRING = /(?<=`).*?(?=`)/gs

// 非ASCLL字符
export const NON_ASCII_CHARACTERS = /[^\u{0}-\u{7F}]/u

// 字母
export const LETTER = /\p{Letter}*/ug

// 特殊字符
export const SPECIAL_CHARACTERS = /[\s`~!@#$%^&*()_\-+=<>?:{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/gim
