import * as fs from "fs";
import * as YAML from "yaml";

import * as utils from "./utils/utils";

const title = "卷一卷二每题分开";
const file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
let jsonFile = YAML.parse(file);

let _data = [];

for (var i = 0; i < jsonFile.length; i++) {
  // console.log(jsonFile[i]);
  let content = String(jsonFile[i].item).trim(); //要分析的内容那一列的名字 TODO: 每次跑的时候改
  // console.log(content);
  let result = utils.getTotalCountAndUniqueWords(content);
  let totalCount = result[0];
  let exist = result[1]; //不重复的字
  let newContent = result[2]; //分句后的内容

  // --------------
  let q: any = {};
  q.id = jsonFile[i].id;
  q.content = content;
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
