"use strict";
exports.__esModule = true;
// 跑篇章的几个指标
var fs = require("fs");
var YAML = require("yaml");
var utils = require("./utils/utils");
var title = "课本";
var file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
var jsonFile = YAML.parse(file);
var _data = [];
for (var i = 0; i < jsonFile.length; i++) {
    var contentArray = jsonFile[i].text;
    //   console.log(contentArray);
    var q = {};
    //   q.volume = jsonFile[i].volume;
    //   q.numberInVolume = jsonFile[i].numberInVolume;
    q.title = jsonFile[i].title;
    //   q.pageCount = jsonFile[i].pageCount;
    //   q.pictureCount = jsonFile[i].pictureCount;
    q.source = jsonFile[i].source;
    var countsPerPage = [];
    q.countsPerPage = countsPerPage;
    var result = utils.getTotalCountAndUniqueWords(contentArray);
    var totalCount = result[0];
    var exist = result[1]; //不重复的字
    var newContent = result[2]; //分句后的内容
    q.content = contentArray;
    q.totalCount = utils.getTotalCountLevel(totalCount, 80, 150, 200, 250, 350, 450, 550, 650, 750, 1000, 1300, 1800);
    var uL = utils.getUniqueLevel(exist.size, 25, 50, 80, 110, 150, 200, 250, 300, 400, 600, 800, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000);
    q.uniqueCount = uL[1];
    var wL = utils.getwordDifficultyLevel(exist);
    q.wordDifficulty = wL[1];
    q.notInList = wL[2];
    q.percent = (exist.size / totalCount).toFixed(2);
    var sL = utils.getSentenceDifficulty(totalCount, newContent, 10, 12, 14, 16, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33);
    q.sentenceDifficulty = sL[1];
    q.resultLevel = utils.getResultLevel(sL[0], uL[0], wL[0]);
    //   q.countOnAverage = utils.getCountOnAverageLevel(
    //     totalCount,
    //     contentArray.length - 1
    //   );
    //   q.countPerPage = utils.getCountPerPageLevel(
    //     contentArray,
    //     contentArray.length - 1
    //   );
    //   q.pictureWeight = utils.getPictureWeightLevel(
    //     totalCount,
    //     jsonFile[i].pictureCount
    //   );
    _data.push(q);
}
utils.exportXlsx(_data, title, [
    //   "volume",
    //   "numberInVolume",
    "title",
    "content",
    //   "pageCount",
    //   "countOnAverage",
    //   "countsPerPage",
    //   "countPerPage",
    //   "pictureWeight",
    //   "pictureCount",
    "totalCount",
    "uniqueCount",
    "percent",
    "wordDifficulty",
    "notInList",
    "sentenceDifficulty",
    "resultLevel",
    "source",
]);
