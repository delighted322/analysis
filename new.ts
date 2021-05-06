import { count } from "console";
//  跑绘本的文件   命令： tsc new && node new

import * as fs from "fs";
import * as YAML from "yaml";

import * as utils from "./utils/utils";

const title = "绘本一到六卷";
const file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
let jsonFile = YAML.parse(file);

let _data = [];

for (var i = 0; i < jsonFile.length; i++) {
  let contentArray = jsonFile[i].content;
  //   console.log(contentArray);

  let q: any = {};
  q.volume = jsonFile[i].volume;
  q.numberInVolume = jsonFile[i].numberInVolume;
  q.title = contentArray[0];
  // if (q.title != "长江") {
  //   continue;
  // }
  q.pageCount = jsonFile[i].pageCount;
  q.pictureCount = jsonFile[i].pictureCount;

  let content = "";
  let countsPerPage = [];
  for (let i = 1; i < contentArray.length; i++) {
    content += contentArray[i] + "。";
    let num = 0;
    for (let j = 0; j < contentArray[i].length; j++) {
      if (utils.isChinese(contentArray[i][j])) {
        num += 1;
      }
    }
    countsPerPage.push(num);
  }
  q.countsPerPage = countsPerPage;
  let result = utils.getTotalCountAndUniqueWords(content);
  let totalCount = result[0];
  let exist = result[1]; //不重复的字
  let newContent = result[2]; //分句后的内容
  q.content = contentArray;
  q.totalCount = utils.getTotalCountLevel(
    // 改总字数
    totalCount,
    80,
    150,
    200,
    250,
    350,
    450,
    550,
    650,
    750,
    1000,
    1300,
    1800
  );
  let uL = utils.getUniqueLevel(
    // 改不重复字总数
    exist.size,
    25,
    80,
    110,
    150,
    200,
    250,
    300,
    400,
    600,
    800,
    1000
  );
  q.uniqueCount = uL[1];
  let wL = utils.getwordDifficultyLevel(exist);
  q.wordDifficulty = wL[1];
  q.notInList = wL[2];
  q.level1 = wL[3];
  q.level2 = wL[4];
  q.level3 = wL[5];
  q.level4 = wL[6];
  q.level5 = wL[7];
  q.level6 = wL[8];
  q.level7 = wL[9];
  q.level8 = wL[10];
  let sL = utils.getSentenceDifficulty(
    // 改句子难度
    totalCount,
    newContent,
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
    31
  );
  q.sentenceDifficulty = sL[1];
  q.resultLevel = utils.getResultLevel(sL[0], uL[0], wL[0]);

  let cOA = utils.getCountOnAverageLevel(totalCount, contentArray.length - 1);
  q.countOnAverage = cOA[0];
  let cPPL = utils.getCountPerPageLevel(contentArray, contentArray.length - 1);
  q.countPerPage = cPPL[0];
  q.averageValue = utils.getValue(
    uL[0],
    wL[0],
    sL[2],
    cPPL[1],
    cOA[1],
    0.2, //uniqueWeight     改权重
    0.2, //wordDifficultyWeight
    0.2, //sentenceDifficultyWeight
    0.2, //countPerPageWeight
    0.2 //countOnAverageWeight
  );
  q.lengthLevel = utils.getLengthLevel(
    contentArray.length - 1,
    totalCount / (contentArray.length - 1)
  );
  q.confidenceLevel = utils.getConfidenceLevel(
    // 改求置信度最高的级别时各个指标的权重
    q.lengthLevel,
    uL[0],
    wL[0],
    sL[2],
    0.4,
    0.2,
    0.2,
    0.2
  );
  q.pictureWeight = utils.getPictureWeightLevel(
    totalCount,
    jsonFile[i].pictureCount
  );
  _data.push(q);
}

utils.exportXlsx(_data, title, [
  "volume",
  "numberInVolume",
  "title",
  "content",
  "pageCount",
  "countOnAverage",
  "countsPerPage",
  "countPerPage",
  "pictureWeight",
  "pictureCount",
  "totalCount",
  "lengthLevel",
  "uniqueCount",
  "wordDifficulty",
  "sentenceDifficulty",
  // "level1",
  // "level2",
  // "level3",
  // "level4",
  // "level5",
  // "level6",
  // "level7",
  // "level8",
  // "notInList",
  // "resultLevel",
  "averageValue",
  "confidenceLevel",
]);
