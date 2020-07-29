"use strict";
// 冰哥给的格式
exports.__esModule = true;
var fs = require("fs");
var YAML = require("yaml");
var utils = require("./utils/utils");
var title = "绘本一到五卷";
var file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
var jsonFile = YAML.parse(file);
var _data = [];
for (var i = 0; i < jsonFile.length; i++) {
    var contentArray = jsonFile[i].content;
    //   console.log(contentArray);
    var q = {};
    q.volume = jsonFile[i].volume;
    q.numberInVolume = jsonFile[i].numberInVolume;
    q.title = contentArray[0];
    q.pageCount = jsonFile[i].pageCount;
    q.pictureCount = jsonFile[i].pictureCount;
    var content = "";
    for (var i_1 = 1; i_1 < contentArray.length; i_1++) {
        content += contentArray[i_1] + "。";
    }
    var result = utils.getTotalCountAndUniqueWords(content);
    var totalCount = result[0];
    var exist = result[1]; //不重复的字
    var newContent = result[2]; //分句后的内容
    q.content = contentArray;
    q.totalCount = utils.getTotalCountLevel(totalCount, 80, 150, 200, 250);
    q.uniqueCount = utils.getUniqueLevel(exist.size, 40, 80, 150, 200);
    q.wordDifficulty = utils.getwordDifficultyLevel(exist);
    q.sentenceDifficulty = utils.getSentenceDifficulty(totalCount, newContent, 10, 15, 20, 25);
    q.countOnAverage = utils.getCountOnAverageLevel(totalCount, contentArray.length - 1);
    q.countPerPage = utils.getCountPerPageLevel(contentArray, contentArray.length - 1);
    q.pictureWeight = utils.getPictureWeightLevel(totalCount, jsonFile[i].pictureCount);
    _data.push(q);
}
utils.exportXlsx(_data, title, [
    "volume",
    "numberInVolume",
    "title",
    "content",
    "pageCount",
    "countOnAverage",
    "countPerPage",
    "pictureWeight",
    "pictureCount",
    "totalCount",
    "uniqueCount",
    "wordDifficulty",
    "sentenceDifficulty"
]);
