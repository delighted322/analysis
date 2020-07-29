"use strict";
exports.__esModule = true;
var XLSX = require("xlsx");
var level = require("./wordLevel");
var utils = require("./utils");
// 判断这个字符是不是中文
function isChinese(str) {
    var re = new RegExp("[\u4E00-\u9FA5]+");
    if (re.test(str))
        return true;
    return false;
}
exports.isChinese = isChinese;
function getTotalCountAndUniqueWords(content) {
    var totalCount = 0;
    var exist = new Map();
    var temp = "";
    var newContent = [];
    for (var j = 0; j < content.length; j++) {
        if (utils.isChinese(content[j])) {
            totalCount += 1;
            if (!exist.has(content[j])) {
                exist.set(content[j], "1");
            }
        }
        temp += content[j];
        if (content[j] == "。" ||
            content[j] == "？" ||
            content[j] == "！" ||
            j == content.length - 1) {
            if (utils.isChinese(temp)) {
                newContent.push(temp);
            }
            temp = "";
            continue;
        }
    }
    return [totalCount, exist, newContent];
}
exports.getTotalCountAndUniqueWords = getTotalCountAndUniqueWords;
function getTotalCountLevel(totalCount, l1, l2, l3, l4) {
    if (totalCount <= l1) {
        return "L1(" + totalCount + ")";
    }
    else if (totalCount <= l2) {
        return "L2(" + totalCount + ")";
    }
    else if (totalCount <= l3) {
        return "L3(" + totalCount + ")";
    }
    else if (totalCount <= l4) {
        //TODO: 按250和300各跑一遍
        return "L4(" + totalCount + ")";
    }
    else {
        return totalCount;
    }
}
exports.getTotalCountLevel = getTotalCountLevel;
function getUniqueLevel(uniqueCount, l1, l2, l3, l4) {
    if (uniqueCount <= l1) {
        return "L1(" + uniqueCount + ")";
    }
    else if (uniqueCount <= l2) {
        return "L2(" + uniqueCount + ")";
    }
    else if (uniqueCount <= l3) {
        return "L3(" + uniqueCount + ")";
    }
    else if (uniqueCount <= l4) {
        return "L4(" + uniqueCount + ")";
    }
    else {
        return uniqueCount;
    }
}
exports.getUniqueLevel = getUniqueLevel;
function getwordDifficultyLevel(exist) {
    var wordDifficulty = "";
    var numInLevel1234 = 0;
    exist.forEach(function (value, key) {
        if ((level.level1 + level.level2 + level.level3 + level.level4).indexOf(key) != -1) {
            numInLevel1234 += 1;
        }
    });
    var level4Percent = numInLevel1234 / exist.size;
    if (level4Percent > 0.7)
        wordDifficulty += "L4(" + level4Percent.toFixed(2) + ") ";
    var numInLevel123 = 0;
    exist.forEach(function (value, key) {
        if ((level.level1 + level.level2 + level.level3).indexOf(key) != -1) {
            numInLevel123 += 1;
        }
    });
    var level3Percent = numInLevel123 / exist.size;
    if (level3Percent > 0.7)
        wordDifficulty += "L3(" + level3Percent.toFixed(2) + ") ";
    var numInLevel12 = 0;
    exist.forEach(function (value, key) {
        if ((level.level1 + level.level2).indexOf(key) != -1) {
            numInLevel12 += 1;
        }
    });
    var level2Percent = numInLevel12 / exist.size;
    if (level2Percent > 0.7)
        wordDifficulty += "L2(" + level2Percent.toFixed(2) + ") ";
    var numInLevel1 = 0;
    exist.forEach(function (value, key) {
        if (level.level1.indexOf(key) != -1) {
            numInLevel1 += 1;
        }
    });
    var level1Percent = numInLevel1 / exist.size;
    if (level1Percent > 0.7)
        wordDifficulty += "L1(" + level1Percent.toFixed(2) + ")";
    if (wordDifficulty == "") {
        wordDifficulty =
            level4Percent.toFixed(2) +
                "," +
                level3Percent.toFixed(2) +
                "," +
                level2Percent.toFixed(2) +
                "," +
                level1Percent.toFixed(2);
    }
    return wordDifficulty;
}
exports.getwordDifficultyLevel = getwordDifficultyLevel;
function getSentenceDifficulty(totalCount, content, l1, l2, l3, l4) {
    var sentenceDifficulty = totalCount / content.length;
    if (sentenceDifficulty <= l1) {
        return "L1(" + sentenceDifficulty.toFixed(2) + ")";
    }
    else if (sentenceDifficulty <= l2) {
        return "L2(" + sentenceDifficulty.toFixed(2) + ")";
    }
    else if (sentenceDifficulty <= l3) {
        return "L3(" + sentenceDifficulty.toFixed(2) + ")";
    }
    else if (sentenceDifficulty <= l4) {
        return "L4(" + sentenceDifficulty.toFixed(2) + ")";
    }
    else {
        return Math.round(sentenceDifficulty);
    }
}
exports.getSentenceDifficulty = getSentenceDifficulty;
// 每页平均字数
function getCountOnAverageLevel(totalCount, pageWithWords) {
    var result = totalCount / pageWithWords;
    if (result <= 10)
        return "L1(" + result.toFixed(2) + ")"; // TODO: 这里是小于还是小于等于
    if (result <= 20)
        return "L2(" + result.toFixed(2) + ")";
    if (result <= 30)
        return "L2(" + result.toFixed(2) + ")";
    if (result <= 40)
        return "L2(" + result.toFixed(2) + ")";
}
exports.getCountOnAverageLevel = getCountOnAverageLevel;
// 篇幅
function getCountPerPageLevel(contentArray, pageWithWords) {
    var countL1 = 0;
    var countL2 = 0;
    var countL3 = 0;
    var countL4 = 0;
    var tempCount = 0;
    var countPerPage = "";
    for (var i = 1; i < contentArray.length; i++) {
        tempCount = getTotalCountAndUniqueWords(contentArray[i])[0];
        if (tempCount <= 10)
            countL1 += 1;
        if (tempCount <= 20)
            countL2 += 1;
        if (tempCount <= 30)
            countL3 += 1;
        if (tempCount <= 40)
            countL4 += 1;
    }
    if (countL4 / pageWithWords > 0.9)
        countPerPage += "L4(" + (countL4 / pageWithWords).toFixed(2) + ")";
    if (countL3 / pageWithWords > 0.9)
        countPerPage += "L3(" + (countL3 / pageWithWords).toFixed(2) + ")";
    if (countL2 / pageWithWords > 0.9)
        countPerPage += "L2(" + (countL2 / pageWithWords).toFixed(2) + ")";
    if (countL1 / pageWithWords > 0.9)
        countPerPage += "L1(" + (countL1 / pageWithWords).toFixed(2) + ")";
    if (countPerPage == "") {
        countPerPage +=
            (countL4 / pageWithWords).toFixed(2) +
                "," +
                (countL3 / pageWithWords).toFixed(2) +
                "," +
                (countL2 / pageWithWords).toFixed(2) +
                "," +
                (countL1 / pageWithWords).toFixed(2);
    }
    return countPerPage;
}
exports.getCountPerPageLevel = getCountPerPageLevel;
// 图片信息占比
function getPictureWeightLevel(totalCount, pictureCount) {
    var weight = totalCount / pictureCount;
    if (weight <= 10)
        return "L1(" + weight.toFixed(2) + ")";
    if (weight <= 20)
        return "L2(" + weight.toFixed(2) + ")";
    if (weight <= 25)
        return "L3(" + weight.toFixed(2) + ")";
    if (weight <= 30)
        return "L4(" + weight.toFixed(2) + ")";
    return weight;
}
exports.getPictureWeightLevel = getPictureWeightLevel;
// 导出表格
function exportXlsx(_data, title, columNames) {
    var _headers = columNames;
    var headers = _headers
        .map(function (v, i) {
        return Object.assign({ v: v, position: String.fromCharCode(65 + i) + 1 });
    })
        .reduce(function (prev, next) {
        var _a;
        return Object.assign({}, prev, (_a = {}, _a[next.position] = { v: next.v }, _a));
    }, {});
    var data = _data
        .map(function (v, i) {
        return _headers.map(function (k, j) {
            return Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) });
        });
    })
        .reduce(function (prev, next) { return prev.concat(next); })
        .reduce(function (prev, next) {
        var _a;
        return Object.assign({}, prev, (_a = {}, _a[next.position] = { v: next.v }, _a));
    }, {});
    var output = Object.assign({}, headers, data);
    var outputPos = Object.keys(output);
    var ref = outputPos[0] + ":" + outputPos[outputPos.length - 1];
    var wb = {
        SheetNames: ["Sheet1"],
        Sheets: {
            Sheet1: Object.assign({}, output, { "!ref": ref })
        }
    };
    XLSX.writeFile(wb, title + ".xlsx");
}
exports.exportXlsx = exportXlsx;
