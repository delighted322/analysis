import { count } from "console";
// 跑篇章的几个指标

import * as fs from "fs";
import * as YAML from "yaml";

import * as utils from "./utils/utils";

const title = "课本";
const file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
let jsonFile = YAML.parse(file);

let _data = [];

for (var i = 0; i < jsonFile.length; i++) {
  let contentArray = jsonFile[i].text;
  //   console.log(contentArray);

  let q: any = {};
  //   q.volume = jsonFile[i].volume;
  //   q.numberInVolume = jsonFile[i].numberInVolume;
  q.title = jsonFile[i].title;
  //   q.pageCount = jsonFile[i].pageCount;
  //   q.pictureCount = jsonFile[i].pictureCount;
  q.source = jsonFile[i].source;

  let countsPerPage = [];

  q.countsPerPage = countsPerPage;
  let result = utils.getTotalCountAndUniqueWords(contentArray);
  let totalCount = result[0];
  let exist = result[1]; //不重复的字
  let newContent = result[2]; //分句后的内容
  q.content = contentArray;
  q.totalCount = utils.getTotalCountLevel(
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
    exist.size,
    25,
    50,
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
  q.percent = (exist.size / totalCount).toFixed(2);
  let sL = utils.getSentenceDifficulty(
    totalCount,
    newContent,
    10,
    12,
    14,
    16,
    18,
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
    32,
    33
  );
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
  "percent", // 不重复字数/总字数
  "wordDifficulty",
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "notInList",
  "sentenceDifficulty",
  "resultLevel",
  "source",
]);
