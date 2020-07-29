// 冰哥给的格式

import * as fs from "fs";
import * as YAML from "yaml";

import * as utils from "./utils/utils";

const title = "绘本一到五卷";
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
  q.pageCount = jsonFile[i].pageCount;
  q.pictureCount = jsonFile[i].pictureCount;

  let content = "";
  for (let i = 1; i < contentArray.length; i++) {
    content += contentArray[i] + "。";
  }
  let result = utils.getTotalCountAndUniqueWords(content);
  let totalCount = result[0];
  let exist = result[1]; //不重复的字
  let newContent = result[2]; //分句后的内容
  q.content = contentArray;
  q.totalCount = utils.getTotalCountLevel(totalCount, 80, 150, 200, 250);
  q.uniqueCount = utils.getUniqueLevel(exist.size, 40, 80, 150, 200);
  q.wordDifficulty = utils.getwordDifficultyLevel(exist);
  q.sentenceDifficulty = utils.getSentenceDifficulty(
    totalCount,
    newContent,
    10,
    15,
    20,
    25
  );

  q.countOnAverage = utils.getCountOnAverageLevel(
    totalCount,
    contentArray.length - 1
  );
  q.countPerPage = utils.getCountPerPageLevel(
    contentArray,
    contentArray.length - 1
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
  "countPerPage",
  "pictureWeight",
  "pictureCount",
  "totalCount",
  "uniqueCount",
  "wordDifficulty",
  "sentenceDifficulty"
]);
