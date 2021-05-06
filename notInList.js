"use strict";
exports.__esModule = true;
// 跑不在字库里的字的字频
var fs = require("fs");
var YAML = require("yaml");
var utils = require("./utils/utils");
var title = "不在字表内的字";
var file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
var jsonFile = YAML.parse(file);
var _data = [];
var notInListFrequency = new Map();
for (var i = 0; i < jsonFile.length; i++) {
    var content = jsonFile[i].content;
    for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
        var s = content_1[_i];
        if (!utils.isChinese(s)) {
            continue;
        }
        if (!utils.isInList(s)) {
            if (notInListFrequency.has(s)) {
                notInListFrequency.set(s, notInListFrequency.get(s) + 1);
            } else {
                notInListFrequency.set(s, 1);
            }
        }
    }
}
// console.log(notInListFrequency);
notInListFrequency.forEach(function (value, key) {
    var q = {};
    q.word = key;
    q.frequency = value;
    _data.push(q);
});
utils.exportXlsx(_data, title, ["word", "frequency"]);