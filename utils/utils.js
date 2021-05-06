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
// 把文本内容分页
function getSplitContent(content) {
    var contentArray = [];
    var str = "";
    for (var i = 0; i < content.length; i++) {
        if (content[i] != "&") {
            str += content[i];
        }
        else {
            if (isChinese(str)) {
                contentArray.push(str);
            }
            str = "";
        }
        if (i == content.length - 1) {
            if (isChinese(str)) {
                contentArray.push(str);
            }
        }
    }
    return contentArray;
}
exports.getSplitContent = getSplitContent;
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
            content[j] == "？" || //英文的问号
            content[j] == "?" ||
            content[j] == "！" ||
            content[j] == "!" || //英文的感叹号
            j == content.length - 1) {
            if (utils.isChinese(temp) && temp != "") {
                newContent.push(temp);
            }
            temp = "";
            continue;
        }
    }
    return [totalCount, exist, newContent];
}
exports.getTotalCountAndUniqueWords = getTotalCountAndUniqueWords;
function getTotalCountLevel(totalCount, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12) {
    if (totalCount <= l1) {
        return "L01(" + totalCount + ")";
    }
    else if (totalCount <= l2) {
        return "L02(" + totalCount + ")";
    }
    else if (totalCount <= l3) {
        return "L03(" + totalCount + ")";
    }
    else if (totalCount <= l4) {
        return "L04(" + totalCount + ")";
    }
    else if (totalCount <= l5) {
        return "L05(" + totalCount + ")";
    }
    else if (totalCount <= l6) {
        return "L06(" + totalCount + ")";
    }
    else if (totalCount <= l7) {
        return "L07(" + totalCount + ")";
    }
    else if (totalCount <= l8) {
        return "L08(" + totalCount + ")";
    }
    else if (totalCount <= l9) {
        return "L09(" + totalCount + ")";
    }
    else if (totalCount <= l10) {
        return "L10(" + totalCount + ")";
    }
    else if (totalCount <= l11) {
        return "L11(" + totalCount + ")";
    }
    else if (totalCount <= l12) {
        return "L12(" + totalCount + ")";
    }
    else {
        return totalCount;
    }
}
exports.getTotalCountLevel = getTotalCountLevel;
function getLengthLevel(pageCount, countOnAverage) {
    // console.log(pageCount, countOnAverage);
    var d = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    ];
    var countList = [8, 15, 20, 25, 40, 80, 150, 200, 300, 500];
    var pageList = [10, 20, 50, 100, 200, 500];
    var p = 0;
    var c = 0;
    for (var i = 0; i < pageList.length; i++) {
        if (pageCount < pageList[i]) {
            p = i;
            break;
        }
    }
    if (pageCount >= pageList[pageList.length - 1])
        p = 6;
    for (var i = 0; i < countList.length; i++) {
        if (countOnAverage < countList[i]) {
            c = i;
            break;
        }
    }
    if (countOnAverage >= countList[countList.length - 1])
        c = 10;
    // console.log(p, c, d[p][c]);
    // let result = "";
    // if (d[p][c] < 10) {
    //   return "L0" + d[p][c];
    // } else {
    //   return "L" + d[p][c];
    // }
    return d[p][c];
}
exports.getLengthLevel = getLengthLevel;
function getUniqueLevel(// 25,50,80,110,150,200,250,300,400,600,800,1000
uniqueCount, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11) {
    if (uniqueCount <= l1) {
        return [1, "L01(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l2) {
        return [2, "L02(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l3) {
        return [3, "L03(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l4) {
        return [4, "L04(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l5) {
        return [5, "L05(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l6) {
        return [6, "L06(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l7) {
        return [7, "L07(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l8) {
        return [8, "L08(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l9) {
        return [9, "L09(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l10) {
        return [10, "L10(" + uniqueCount + ")"];
    }
    else if (uniqueCount <= l11) {
        return [11, "L11(" + uniqueCount + ")"];
    }
    else {
        return [12, "L12(" + uniqueCount + ")"];
    }
}
exports.getUniqueLevel = getUniqueLevel;
function isInList(s) {
    if ((level.level1 +
        level.level2 +
        level.level3 +
        level.level4 +
        level.level5 +
        level.level6 +
        level.level7 +
        level.level8).indexOf(s) == -1) {
        return false;
    }
    return true;
}
exports.isInList = isInList;
function getwordDifficultyLevel(exist) {
    var wordDifficulty = "";
    var first = "";
    var num = 0;
    var notInList = "";
    var numInLevel = 0;
    var numInLevel2 = 0;
    var numInLevel3 = 0;
    var numInLevel4 = 0;
    var numInLevel5 = 0;
    var numInLevel6 = 0;
    var numInLevel7 = 0;
    var numInLevel8 = 0;
    // exist.forEach((value,key) => {
    //   if (level.level1.indexOf(key) != -1) {
    //   }
    // })
    var topLevel = 0;
    exist.forEach(function (value, key) {
        if (level.level1.indexOf(key) != -1) {
            numInLevel += 1;
            if (topLevel < 1) {
                topLevel = 1;
            }
        }
        if (level.level2.indexOf(key) != -1) {
            numInLevel2 += 1;
            if (topLevel < 2) {
                topLevel = 2;
            }
        }
        if (level.level3.indexOf(key) != -1) {
            numInLevel3 += 1;
            if (topLevel < 3) {
                topLevel = 3;
            }
        }
        if (level.level4.indexOf(key) != -1) {
            numInLevel4 += 1;
            if (topLevel < 4) {
                topLevel = 4;
            }
        }
        if (level.level5.indexOf(key) != -1) {
            numInLevel5 += 1;
            if (topLevel < 5) {
                topLevel = 5;
            }
        }
        if (level.level6.indexOf(key) != -1) {
            numInLevel6 += 1;
            if (topLevel < 6) {
                topLevel = 6;
            }
        }
        if (level.level7.indexOf(key) != -1) {
            numInLevel7 += 1;
            if (topLevel < 7) {
                topLevel = 7;
            }
        }
        if (level.level8.indexOf(key) != -1) {
            numInLevel8 += 1;
            if (topLevel < 8) {
                topLevel = 8;
            }
        }
    });
    var level8Percent = 0;
    var level7Percent = 0;
    var level6Percent = 0;
    var level5Percent = 0;
    var level4Percent = 0;
    var level3Percent = 0;
    var level2Percent = 0;
    var level1Percent = 0;
    if (topLevel == 8) {
        var numInLevel12345678_1 = 0;
        var numNotInLevel12345678_1 = 0;
        exist.forEach(function (value, key) {
            if ((level.level1 +
                level.level2 +
                level.level3 +
                level.level4 +
                level.level5 +
                level.level6 +
                level.level7 +
                level.level8).indexOf(key) != -1) {
                numInLevel12345678_1 += 1;
            }
            else {
                notInList += key + ", ";
                numNotInLevel12345678_1 += 1;
            }
        });
        level8Percent = numInLevel12345678_1 / exist.size;
        if (numNotInLevel12345678_1 <= 10 || level8Percent > 0.96) {
            //改字词难度
            wordDifficulty += "L20(" + level8Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L21";
                num = 21;
            }
        }
        if (numNotInLevel12345678_1 <= 10 || level8Percent > 0.97) {
            wordDifficulty += "L19(" + level8Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L20";
                num = 20;
            }
        }
        if (numNotInLevel12345678_1 <= 10 || level8Percent > 0.98) {
            wordDifficulty += "L18(" + level8Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L19";
                num = 19;
            }
        }
        if (numNotInLevel12345678_1 <= 10 || level8Percent > 0.99) {
            wordDifficulty += "L17(" + level8Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L18";
                num = 18;
            }
        }
    }
    if (topLevel >= 7) {
        var numInLevel1234567_1 = 0;
        var numNotInLevel1234567_1 = 0;
        exist.forEach(function (value, key) {
            if ((level.level1 +
                level.level2 +
                level.level3 +
                level.level4 +
                level.level5 +
                level.level6 +
                level.level7).indexOf(key) != -1) {
                numInLevel1234567_1 += 1;
            }
            else {
                numNotInLevel1234567_1 += 1;
            }
        });
        level7Percent = numInLevel1234567_1 / exist.size;
        if (numNotInLevel1234567_1 <= 10 || level7Percent > 0.96) {
            wordDifficulty += "L16(" + level7Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L17";
                num = 17;
            }
        }
        if (numNotInLevel1234567_1 <= 10 || level7Percent > 0.97) {
            wordDifficulty += "L15(" + level7Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L16";
                num = 16;
            }
        }
        if (numNotInLevel1234567_1 <= 10 || level7Percent > 0.98) {
            wordDifficulty += "L14(" + level7Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L15";
                num = 15;
            }
        }
        if (numNotInLevel1234567_1 <= 10 || level7Percent > 0.99) {
            wordDifficulty += "L13(" + level7Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L14";
                num = 14;
            }
        }
    }
    if (topLevel >= 6) {
        var numInLevel123456_1 = 0;
        var numNotInLevel123456_1 = 0;
        exist.forEach(function (value, key) {
            if ((level.level1 +
                level.level2 +
                level.level3 +
                level.level4 +
                level.level5 +
                level.level6).indexOf(key) != -1) {
                numInLevel123456_1 += 1;
            }
            else {
                numNotInLevel123456_1 += 1;
            }
        });
        level6Percent = numInLevel123456_1 / exist.size;
        if (numNotInLevel123456_1 <= 10 || level6Percent > 0.92) {
            wordDifficulty += "L12(" + level6Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L13";
                num = 13;
            }
        }
        if (numNotInLevel123456_1 <= 10 || level6Percent > 0.94) {
            wordDifficulty += "L11(" + level6Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L12";
                num = 12;
            }
        }
        if (numNotInLevel123456_1 <= 10 || level6Percent > 0.96) {
            wordDifficulty += "L10(" + level6Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L11";
                num = 11;
            }
        }
        if (numNotInLevel123456_1 <= 10 || level6Percent > 0.98) {
            wordDifficulty += "L09(" + level5Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L10";
                num = 10;
            }
        }
    }
    if (topLevel >= 5) {
        var numInLevel12345_1 = 0;
        var numNotInLevel12345_1 = 0;
        exist.forEach(function (value, key) {
            if ((level.level1 +
                level.level2 +
                level.level3 +
                level.level4 +
                level.level5).indexOf(key) != -1) {
                numInLevel12345_1 += 1;
            }
            else {
                numNotInLevel12345_1 += 1;
            }
        });
        level5Percent = numInLevel12345_1 / exist.size;
        if (numNotInLevel12345_1 <= 10 || level5Percent > 0.8) {
            wordDifficulty += "L08(" + level5Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L09";
                num = 9;
            }
        }
        if (numNotInLevel12345_1 <= 10 || level5Percent > 0.85) {
            wordDifficulty += "L07(" + level5Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L08";
                num = 8;
            }
        }
        if (numNotInLevel12345_1 <= 10 || level5Percent > 0.9) {
            wordDifficulty += "L06(" + level5Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L07";
                num = 7;
            }
        }
        if (numNotInLevel12345_1 <= 10 || level5Percent > 0.95) {
            wordDifficulty += "L05(" + level5Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L06";
                num = 6;
            }
        }
    }
    if (topLevel >= 4) {
        var numInLevel1234_1 = 0;
        var numNotInLevel1234_1 = 0;
        exist.forEach(function (value, key) {
            if ((level.level1 + level.level2 + level.level3 + level.level4).indexOf(key) != -1) {
                numInLevel1234_1 += 1;
            }
            else {
                numNotInLevel1234_1 += 1;
            }
        });
        level4Percent = numInLevel1234_1 / exist.size;
        // console.log("---", numNotInLevel1234);
        if (numNotInLevel1234_1 <= 10 || level4Percent > 0.75) {
            wordDifficulty += "L04(" + level4Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L05";
                num = 5;
            }
        }
    }
    if (topLevel >= 3) {
        var numInLevel123_1 = 0;
        var numNotInLevel123_1 = 0;
        exist.forEach(function (value, key) {
            if ((level.level1 + level.level2 + level.level3).indexOf(key) != -1) {
                numInLevel123_1 += 1;
            }
            else {
                numNotInLevel123_1 += 1;
            }
        });
        level3Percent = numInLevel123_1 / exist.size;
        if (numNotInLevel123_1 <= 10 || level3Percent > 0.7) {
            wordDifficulty += "L03(" + level3Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L04";
                num = 4;
            }
        }
    }
    if (topLevel >= 2) {
        var numInLevel12_1 = 0;
        var numNotInLevel12_1 = 0;
        exist.forEach(function (value, key) {
            if ((level.level1 + level.level2).indexOf(key) != -1) {
                numInLevel12_1 += 1;
            }
            else {
                numNotInLevel12_1 += 1;
            }
        });
        level2Percent = numInLevel12_1 / exist.size;
        if (numNotInLevel12_1 <= 10 || level2Percent > 0.7) {
            wordDifficulty += "L02(" + level2Percent.toFixed(2) + ") ";
        }
        else {
            if (first == "") {
                first = "L03";
                num = 3;
            }
        }
    }
    if (topLevel >= 1) {
        var numInLevel1_1 = 0;
        var numNotInLevel1_1 = 0;
        exist.forEach(function (value, key) {
            if (level.level1.indexOf(key) != -1) {
                numInLevel1_1 += 1;
            }
            else {
                numNotInLevel1_1 += 1;
            }
        });
        level1Percent = numInLevel1_1 / exist.size;
        if (numNotInLevel1_1 <= 10) {
            wordDifficulty += "L01(" + level1Percent.toFixed(2) + ")";
        }
        else {
            if (first == "") {
                first = "L02";
                num = 2;
            }
        }
    }
    if (wordDifficulty == "") {
        wordDifficulty =
            level8Percent.toFixed(2) +
                "," +
                level7Percent.toFixed(2) +
                "," +
                level6Percent.toFixed(2) +
                "," +
                level5Percent.toFixed(2) +
                "," +
                level4Percent.toFixed(2) +
                "," +
                level3Percent.toFixed(2) +
                "," +
                level2Percent.toFixed(2) +
                "," +
                level1Percent.toFixed(2);
    }
    wordDifficulty = first + "## " + wordDifficulty;
    return [
        num,
        wordDifficulty,
        notInList,
        numInLevel,
        numInLevel2,
        numInLevel3,
        numInLevel4,
        numInLevel5,
        numInLevel6,
        numInLevel7,
        numInLevel8,
    ];
}
exports.getwordDifficultyLevel = getwordDifficultyLevel;
// export function getSentenceDifficulty(
//   totalCount: number,
//   content: any[],
//   l1: number,
//   l2: number,
//   l3: number,
//   l4: number,
//   l5: number,
//   l6: number,
//   l7: number,
//   l8: number,
//   l9: number,
//   l10: number,
//   l11: number,
//   l12: number,
//   l13: number,
//   l14: number,
//   l15: number,
//   l16: number,
//   l17: number,
//   l18: number,
//   l19: number
// ) {
//   let sentenceDifficulty = totalCount / content.length;
//   if (sentenceDifficulty <= l1) {
//     return [
//       1,
//       "L01(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l2) {
//     return [
//       2,
//       "L02(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l3) {
//     return [
//       3,
//       "L03(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l4) {
//     return [
//       4,
//       "L04(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l5) {
//     return [
//       5,
//       "L05(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l6) {
//     return [
//       6,
//       "L06(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l7) {
//     return [
//       7,
//       "L07(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l8) {
//     return [
//       8,
//       "L08(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l9) {
//     return [
//       9,
//       "L09(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l10) {
//     return [
//       10,
//       "L10(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l11) {
//     return [
//       11,
//       "L11(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l12) {
//     return [
//       12,
//       "L12(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l13) {
//     return [
//       13,
//       "L13(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l14) {
//     return [
//       14,
//       "L14(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l15) {
//     return [
//       15,
//       "L15(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l16) {
//     return [
//       16,
//       "L16(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l17) {
//     return [
//       17,
//       "L17(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l18) {
//     return [
//       18,
//       "L18(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else if (sentenceDifficulty <= l19) {
//     return [
//       19,
//       "L19(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   } else {
//     return [
//       20,
//       "L20(" + sentenceDifficulty.toFixed(2) + ")",
//       sentenceDifficulty,
//     ];
//   }
// }
function getSentenceDifficulty(totalCount, content) {
    // FIXME: 改句子难度大框的范围
    var sentenceDifficulty = totalCount / content.length;
    if (sentenceDifficulty >= 40)
        return [
            sentenceDifficulty,
            "19~20(" + sentenceDifficulty.toFixed(2) + ")",
            "19~20",
        ];
    if (sentenceDifficulty >= 30)
        return [
            sentenceDifficulty,
            "15~18(" + sentenceDifficulty.toFixed(2) + ")",
            "15~18",
        ];
    if (sentenceDifficulty >= 15)
        return [
            sentenceDifficulty,
            "11~14(" + sentenceDifficulty.toFixed(2) + ")",
            "11~14",
        ];
    if (sentenceDifficulty >= 5)
        return [
            sentenceDifficulty,
            "5~10(" + sentenceDifficulty.toFixed(2) + ")",
            "5~10",
        ];
    return [
        sentenceDifficulty,
        "1~4(" + sentenceDifficulty.toFixed(2) + ")",
        "1~4",
    ];
}
exports.getSentenceDifficulty = getSentenceDifficulty;
// 算最后的级别
function getResultLevel(sentenceLevel, uniqueLevel, wordLevel) {
    var a = Math.abs(sentenceLevel - uniqueLevel);
    var b = Math.abs(sentenceLevel - wordLevel);
    var c = Math.abs(uniqueLevel - wordLevel);
    var min = Math.min(a, b, c);
    var max = Math.max(a, b, c);
    var l = [sentenceLevel, uniqueLevel, wordLevel];
    l = l.sort();
    //如果三个差都一样
    if (min == max) {
        return l[1];
    }
    //如果有两个差一样小
    var L = [a, b, c];
    L = L.sort();
    if (L[0] == L[1]) {
        if (max == a) {
            // b c 一样
            return wordLevel;
        }
        else if (max == b) {
            // a c 一样
            return uniqueLevel;
        }
        else {
            // a b 一样
            return sentenceLevel;
        }
    }
    // 如果最小的差唯一
    if (a == min) {
        return Math.max(sentenceLevel, uniqueLevel);
    }
    else if (b == min) {
        return Math.max(sentenceLevel, wordLevel);
    }
    else {
        return Math.max(uniqueLevel, wordLevel);
    }
}
exports.getResultLevel = getResultLevel;
// 置信度最高的等级
function getConfidenceLevel(type, lengthLevel, uniqueLevel, wordLevel, sentenceLevel, theme, structure, languageFeature, backgroundKnowledge, lengthWeight, uniqueWeight, wordWeight, sentenceWeight, themeWeight, structureWeight, languageFeatureWeight, backgroundKnowledgeWeight) {
    var level = 1;
    var min = unlikelyScore(type, 1, lengthLevel, uniqueLevel, wordLevel, sentenceLevel, theme, structure, languageFeature, backgroundKnowledge, lengthWeight, uniqueWeight, wordWeight, sentenceWeight, themeWeight, structureWeight, languageFeatureWeight, backgroundKnowledgeWeight);
    for (var i = 2; i <= 20; i++) {
        var temp = unlikelyScore(type, i, lengthLevel, uniqueLevel, wordLevel, sentenceLevel, theme, structure, languageFeature, backgroundKnowledge, lengthWeight, uniqueWeight, wordWeight, sentenceWeight, themeWeight, structureWeight, languageFeatureWeight, backgroundKnowledgeWeight);
        // if (i > 10 && i < 14) {
        // console.log(temp, i);
        // }
        if (temp < min) {
            min = temp;
            level = i;
        }
    }
    // console.log("------", level);
    if (level < 10) {
        return "L0" + String(level);
    }
    else {
        return "L" + String(level);
    }
}
exports.getConfidenceLevel = getConfidenceLevel;
function unlikelyScore(type, level, lengthLevel, uniqueLevel, wordLevel, sentenceLevel, theme, structure, languageFeature, backgroundKnowledge, lengthWeight, uniqueWeight, wordWeight, sentenceWeight, themeWeight, structureWeight, languageFeatureWeight, backgroundKnowledgeWeight) {
    // 主题分数
    var themeScore = 0;
    if (type == "绘本（包含漫画）" || "连续文本" || "儿歌、儿童诗") {
        themeScore =
            theme &&
                getScore(theme, [
                    "1~4级",
                    "5~7级",
                    "8~10级",
                    "11~12级",
                    "13~14级",
                    "15~16级",
                    "17~18级",
                    "19~20级",
                ], [
                    [1, 4],
                    [5, 7],
                    [8, 10],
                    [11, 12],
                    [13, 14],
                    [15, 16],
                    [17, 18],
                    [19, 20],
                ], level);
    }
    // 结构分数
    var structureScore = 0;
    // console.log(structure);
    if (type == "绘本（包含漫画）" || "连续文本" || "儿歌、儿童诗") {
        structureScore =
            structure &&
                getScore(structure, ["1~4级", "5~7级", "8~12级", "13~16级", "17~20级"], [
                    [1, 4],
                    [5, 7],
                    [8, 12],
                    [13, 16],
                    [17, 20],
                ], level);
    }
    // 语言特点分数
    var languageFeatureScore = 0;
    if (type == "绘本（包含漫画）") {
        languageFeatureScore =
            languageFeatureScore &&
                getScore(languageFeature, ["1~4级", "5~7级", "8~10级", "11~12级", "13~16级", "17~20级"], [
                    [1, 4],
                    [5, 7],
                    [8, 10],
                    [11, 12],
                    [13, 16],
                    [17, 20],
                ], level);
    }
    if (type == "连续文本") {
        languageFeatureScore =
            languageFeatureScore &&
                getScore(languageFeature, ["1~4级", "5~7级", "8~12级", "13~16级", "17~20级"], [
                    [1, 4],
                    [5, 7],
                    [8, 12],
                    [13, 16],
                    [17, 20],
                ], level);
    }
    if (type == "儿歌、儿童诗") {
        languageFeatureScore =
            languageFeatureScore &&
                getScore(languageFeature, [
                    "1~4级",
                    "5~7级",
                    "8~10级",
                    "11~12级",
                    "13~14级",
                    "15~16级",
                    "17~18级",
                    "19~20级",
                ], [
                    [1, 4],
                    [5, 7],
                    [8, 10],
                    [11, 12],
                    [13, 14],
                    [15, 16],
                    [17, 18],
                    [19, 20],
                ], level);
    }
    // 背景知识分数
    var backgroundKnowledgeScore = backgroundKnowledge &&
        getScore(backgroundKnowledge, ["K", "G1~G2", "G3~G4", "G5~G6", "G6+"], [
            [1, 4],
            [5, 10],
            [11, 14],
            [15, 18],
            [19, 20],
        ], level);
    // let backgroundKnowledgeScore =
    //   backgroundKnowledge &&
    //   getScore(
    //     backgroundKnowledge,
    //     ["K", "G1", "G2", "G3", "G4", "G5", "G6", "G6+"],
    //     [
    //       [1, 4],
    //       [5, 7],
    //       [8, 10],
    //       [11, 12],
    //       [13, 14],
    //       [15, 16],
    //       [17, 18],
    //       [19, 20],
    //     ],
    //     level
    //   );
    var lengthScore = getScore(lengthLevel, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"], [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [8, 8],
        [9, 9],
        [10, 10],
        [11, 20],
    ], level);
    var sentenceScore = getScore(sentenceLevel, ["1~4", "5~10", "11~14", "15~18", "19~20"], [
        [1, 4],
        [5, 10],
        [11, 14],
        [15, 18],
        [19, 20],
    ], level);
    // console.log(
    //   themeScore,
    //   structureScore,
    //   languageFeatureScore,
    //   backgroundKnowledgeScore,
    // lengthScore,
    // lengthLevel,
    // "####",
    // level
    //   lengthLevel,
    //   uniqueLevel,
    //   wordLevel,
    //   sentenceLevel
    // );
    return Math.sqrt(lengthWeight * Math.pow(lengthScore, 2) +
        uniqueWeight * Math.pow(level - uniqueLevel, 2) +
        wordWeight * Math.pow(level - wordLevel, 2) +
        // sentenceWeight * Math.pow(level - sentenceLevel, 2) +
        sentenceWeight * Math.pow(sentenceScore, 2) +
        themeWeight * Math.pow(themeScore, 2) +
        structureWeight * Math.pow(structureScore, 2) +
        languageFeatureWeight * Math.pow(languageFeatureScore, 2) +
        backgroundKnowledgeWeight * Math.pow(backgroundKnowledgeScore, 2));
}
// 主题 结构 语言特点 背景知识分数
function getScore(value, list, number, level) {
    var score = 0;
    var range = []; // 这本书在的范围
    var levelRange = []; // 这个level在的范围
    for (var i = 0; i < list.length; i++) {
        if (list[i] == value) {
            range = number[i]; // 这本书在的范围
            // console.log(range);
            break;
        }
    }
    for (var j = 0; j < number.length; j++) {
        if (level <= number[j][1]) {
            levelRange = number[j];
            break;
        }
    }
    score = (range[0] - levelRange[0] + range[1] - levelRange[1]) / 2;
    // if (value == "17~20级") {
    // console.log(value, level, range, levelRange, score);
    // }
    return score;
}
function getValue(uniqueLevel, wordDifficultyLevel, sentenceDifficulty, countPerPageLevel, countOnAverageLevel, uniqueWeight, wordDifficultyWeight, sentenceDifficultyWeight, countPerPageWeight, countOnAverageWeight) {
    var sentenceLevel = [
        0,
        8,
        10,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
    ];
    var valueList = [
        0,
        450,
        500,
        550,
        600,
        650,
        700,
        750,
        800,
        850,
        900,
        950,
        1000,
        1050,
        1100,
        1150,
        1200,
        1250,
        1275,
        1300,
        1325,
    ];
    var totalValue = 0;
    totalValue += valueList[wordDifficultyLevel] * wordDifficultyWeight;
    totalValue += valueList[countPerPageLevel] * countPerPageWeight;
    totalValue += valueList[countOnAverageLevel] * countOnAverageWeight;
    var sentenceL = 0;
    for (var i = 1; i < sentenceLevel.length; i++) {
        if (sentenceDifficulty <= sentenceLevel[i]) {
            sentenceL = i - 1;
            break;
        }
    }
    if (sentenceDifficulty > sentenceLevel[sentenceLevel.length - 1]) {
        sentenceL = 20;
        totalValue += valueList[sentenceL] * sentenceDifficultyWeight;
    }
    else {
        totalValue +=
            (valueList[sentenceL] +
                ((valueList[sentenceL + 1] - valueList[sentenceL]) *
                    (sentenceDifficulty - sentenceLevel[sentenceL])) /
                    (sentenceLevel[sentenceL + 1] - sentenceLevel[sentenceL])) *
                sentenceDifficultyWeight;
    }
    if (uniqueLevel == 13) {
        return totalValue / (1 - uniqueWeight);
    }
    else {
        totalValue += valueList[uniqueLevel] * uniqueWeight;
        return totalValue.toFixed(2);
    }
}
exports.getValue = getValue;
/**每页平均字数*/
function getCountOnAverageLevel(totalCount, pageWithWords) {
    var result = totalCount / pageWithWords;
    if (result <= 8)
        return ["L01(" + result.toFixed(2) + ")", 1];
    if (result <= 10)
        return ["L02(" + result.toFixed(2) + ")", 2];
    if (result <= 15)
        return ["L03(" + result.toFixed(2) + ")", 3]; // 每页平均字数
    if (result <= 20)
        return ["L04(" + result.toFixed(2) + ")", 4];
    if (result <= 25)
        return ["L05(" + result.toFixed(2) + ")", 5];
    if (result <= 30)
        return ["L06(" + result.toFixed(2) + ")", 6];
    if (result <= 50)
        return ["L07(" + result.toFixed(2) + ")", 7];
    if (result <= 100)
        return ["L08(" + result.toFixed(2) + ")", 8];
    if (result <= 150)
        return ["L09(" + result.toFixed(2) + ")", 9];
    if (result <= 200)
        return ["L10(" + result.toFixed(2) + ")", 10];
    if (result <= 300)
        return ["L11(" + result.toFixed(2) + ")", 11];
    if (result <= 400)
        return ["L12(" + result.toFixed(2) + ")", 12]; // 每页平均字数
    if (result <= 425)
        return ["L13(" + result.toFixed(2) + ")", 13];
    if (result <= 450)
        return ["L14(" + result.toFixed(2) + ")", 14];
    if (result <= 475)
        return ["L15(" + result.toFixed(2) + ")", 15];
    if (result <= 500)
        return ["L16(" + result.toFixed(2) + ")", 16];
    if (result <= 525)
        return ["L17(" + result.toFixed(2) + ")", 17];
    if (result <= 550)
        return ["L18(" + result.toFixed(2) + ")", 18];
    if (result <= 600)
        return ["L19(" + result.toFixed(2) + ")", 19];
    if (result > 600)
        return ["L20(" + result.toFixed(2) + ")", 20];
}
exports.getCountOnAverageLevel = getCountOnAverageLevel;
/** 篇幅 单页字数*/
function getCountPerPageLevel(contentArray, pageWithWords) {
    var countL1 = 0;
    var countL2 = 0;
    var countL3 = 0;
    var countL4 = 0;
    var countL5 = 0;
    var countL6 = 0;
    var countL7 = 0;
    var countL8 = 0;
    var countL9 = 0;
    var countL10 = 0;
    var countL11 = 0;
    var countL12 = 0;
    var countL13 = 0;
    var countL14 = 0;
    var countL15 = 0;
    var countL16 = 0;
    var countL17 = 0;
    var countL18 = 0;
    var countL19 = 0;
    var countL20 = 0;
    var tempCount = 0;
    var countPerPage = "";
    var level = 0;
    for (var i = 1; i < contentArray.length; i++) {
        tempCount = getTotalCountAndUniqueWords(contentArray[i])[0];
        if (tempCount <= 8)
            countL1 += 1; //改篇幅
        if (tempCount <= 12)
            countL2 += 1;
        if (tempCount <= 18)
            countL3 += 1;
        if (tempCount <= 25)
            countL4 += 1;
        if (tempCount <= 35)
            countL5 += 1;
        if (tempCount <= 50)
            countL6 += 1;
        if (tempCount <= 70)
            countL7 += 1;
        if (tempCount <= 120)
            countL8 += 1;
        if (tempCount <= 170)
            countL9 += 1;
        if (tempCount <= 220)
            countL10 += 1;
        if (tempCount <= 320)
            countL11 += 1;
        if (tempCount <= 420)
            countL12 += 1;
        if (tempCount <= 445)
            countL13 += 1;
        if (tempCount <= 475)
            countL14 += 1;
        if (tempCount <= 500)
            countL15 += 1;
        if (tempCount <= 520)
            countL16 += 1;
        if (tempCount <= 550)
            countL17 += 1;
        if (tempCount <= 570)
            countL18 += 1;
        if (tempCount <= 620)
            countL19 += 1;
        if (tempCount > 620)
            countL20 += 1;
    }
    if (countL20 / pageWithWords > 0.9) {
        countPerPage += "L20(" + (countL20 / pageWithWords).toFixed(2) + ")";
    }
    if (countL19 / pageWithWords > 0.9) {
        countPerPage += "L19(" + (countL19 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 20;
        }
    }
    if (countL18 / pageWithWords > 0.9) {
        countPerPage += "L18(" + (countL18 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 19;
        }
    }
    if (countL17 / pageWithWords > 0.9) {
        countPerPage += "L17(" + (countL17 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 18;
        }
    }
    if (countL16 / pageWithWords > 0.9) {
        countPerPage += "L16(" + (countL16 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 17;
        }
    }
    if (countL15 / pageWithWords > 0.9) {
        countPerPage += "L15(" + (countL15 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 16;
        }
    }
    if (countL14 / pageWithWords > 0.9) {
        countPerPage += "L14(" + (countL14 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 15;
        }
    }
    if (countL13 / pageWithWords > 0.9) {
        countPerPage += "L13(" + (countL13 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 14;
        }
    }
    if (countL12 / pageWithWords > 0.9) {
        countPerPage += "L12(" + (countL12 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 13;
        }
    }
    if (countL11 / pageWithWords > 0.9) {
        countPerPage += "L11(" + (countL11 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 12;
        }
    }
    if (countL10 / pageWithWords > 0.9) {
        countPerPage += "L10(" + (countL10 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 11;
        }
    }
    if (countL9 / pageWithWords > 0.9) {
        countPerPage += "L09(" + (countL9 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 10;
        }
    }
    if (countL8 / pageWithWords > 0.9) {
        countPerPage += "L08(" + (countL8 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 9;
        }
    }
    if (countL7 / pageWithWords > 0.9) {
        countPerPage += "L07(" + (countL7 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 8;
        }
    }
    if (countL6 / pageWithWords > 0.9) {
        countPerPage += "L06(" + (countL6 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 7;
        }
    }
    if (countL5 / pageWithWords > 0.9) {
        countPerPage += "L05(" + (countL5 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 6;
        }
    }
    if (countL4 / pageWithWords > 0.9) {
        countPerPage += "L04(" + (countL4 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 5;
        }
    }
    if (countL3 / pageWithWords > 0.9) {
        countPerPage += "L03(" + (countL3 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 4;
        }
    }
    if (countL2 / pageWithWords > 0.9) {
        countPerPage += "L02(" + (countL2 / pageWithWords).toFixed(2) + ")";
    }
    else {
        if (level == 0) {
            level = 3;
        }
    }
    if (countL1 / pageWithWords > 0.95) {
        countPerPage += "L01(" + (countL1 / pageWithWords).toFixed(2) + ")";
        if (level == 0) {
            level = 1;
        }
    }
    else {
        if (level == 0) {
            level = 2;
        }
    }
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
    return [countPerPage, level];
}
exports.getCountPerPageLevel = getCountPerPageLevel;
// 图片信息占比
function getPictureWeightLevel(totalCount, pictureCount) {
    var weight = totalCount / pictureCount;
    if (weight <= 10)
        return "L01(" + weight.toFixed(2) + ")";
    if (weight <= 20)
        return "L02(" + weight.toFixed(2) + ")";
    if (weight <= 25)
        return "L03(" + weight.toFixed(2) + ")";
    if (weight <= 30)
        return "L04(" + weight.toFixed(2) + ")";
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
