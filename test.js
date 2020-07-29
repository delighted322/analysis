"use strict";
exports.__esModule = true;
var fs = require("fs");
var YAML = require("yaml");
var utils = require("./utils/utils");
var title = "卷一卷二每题分开";
var file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
var jsonFile = YAML.parse(file);
var _data = [];
for (var i = 0; i < jsonFile.length; i++) {
    // console.log(jsonFile[i]);
    var content = String(jsonFile[i].item).trim(); //要分析的内容那一列的名字 TODO: 每次跑的时候改
    // console.log(content);
    var result = utils.getTotalCountAndUniqueWords(content);
    var totalCount = result[0];
    var exist = result[1]; //不重复的字
    var newContent = result[2]; //分句后的内容
    // --------------
    var q = {};
    q.id = jsonFile[i].id;
    q.content = content;
    q.totalCount = utils.getTotalCountLevel(totalCount, 80, 150, 200, 250);
    q.uniqueCount = utils.getUniqueLevel(exist.size, 40, 80, 150, 200);
    q.wordDifficulty = utils.getwordDifficultyLevel(exist);
    q.sentenceDifficulty = utils.getSentenceDifficulty(totalCount, newContent, 10, 15, 20, 25);
    _data.push(q);
}
// 导出表格
utils.exportXlsx(_data, title, [
    "id",
    "content",
    "totalCount",
    "uniqueCount",
    "wordDifficulty",
    "sentenceDifficulty"
]);
