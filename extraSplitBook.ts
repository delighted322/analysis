import { count } from "console";
//  跑数据库里的绘本 四千多条 质性的框没有分

import * as fs from "fs";
import * as YAML from "yaml";

import * as utils from "./utils/utils";

const title = "O-Lib-Total-book_text_data-2020-11-19";
const file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
let jsonFile = YAML.parse(file);

let _data = [];

for (var i = 0; i < jsonFile.length; i++) {
  let contentArray = [];

  let c = jsonFile[i].content;

  //  下面两个二选一
  // contentArray = c; // 已经分好页
  contentArray = utils.getSplitContent(c); // 将数据处理好

  let q: any = {};
  q.id = jsonFile[i].ID;
  q.VolumeTitle = jsonFile[i].VolumeTitle;
  q.BookTitle = jsonFile[i].BookTitle;
  q.isbn = jsonFile[i].ISBN;
  q.type = jsonFile[i].type;
  q.type = "绘本（包含漫画）";
  q.grade = jsonFile[i].grade;
  q.source = jsonFile[i].source;
  q.theme = 0;
  q.structure = 0;
  q.languageFeature = 0;
  q.backgroundKnowledge = 0;
  q.pageWithWords = contentArray.length;
  // if (q.title != "我和妈妈的宝贝") {
  //   continue;
  // }
  //   console.log(contentArray);

  let content = "";
  let countsPerPage = [];
  for (let i = 0; i < contentArray.length; i++) {
    content += contentArray[i];
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
  //   console.log(newContent);
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
  //   q.resultLevel = utils.getResultLevel(sL[0], uL[0], wL[0]);

  let cOA = utils.getCountOnAverageLevel(totalCount, contentArray.length);
  q.countOnAverage = cOA[0];
  let cPPL = utils.getCountPerPageLevel(contentArray, contentArray.length);
  q.countPerPage = cPPL[0];
  //   q.averageValue = utils.getValue(
  //     uL[0],
  //     wL[0],
  //     sL[2],
  //     cPPL[1],
  //     cOA[1],
  //     0.2, //uniqueWeight     改权重
  //     0.2, //wordDifficultyWeight
  //     0.2, //sentenceDifficultyWeight
  //     0.2, //countPerPageWeight
  //     0.2 //countOnAverageWeight
  //   );
  q.lengthLevel = utils.getLengthLevel(
    contentArray.length,
    totalCount / contentArray.length
  );
  if (q.type == "绘本（包含漫画）") {
    q.confidenceLevel = utils.getConfidenceLevel(
      // 改求置信度最高的级别时各个指标的权重
      q.type, // 文本类别
      q.lengthLevel, // 篇幅
      uL[0], // 不重复字总数
      wL[0], // 字词难度
      sL[2], // 句子难度
      q.theme,
      q.structure,
      q.languageFeature,
      q.backgroundKnowledge,
      0.4, // 篇幅权重
      0.2, // 不重复字总数权重
      0.2, // 字词难度权重
      0.2, // 句子难度权重,
      0, // 主题权重
      0, // 结构权重
      0, // 语言特点权重
      0 // 知识背景权重
    );
  } else if (q.type == "连续文本") {
    q.confidenceLevel = utils.getConfidenceLevel(
      // 改求置信度最高的级别时各个指标的权重
      q.type, // 文本类别
      q.lengthLevel, // 篇幅
      uL[0], // 不重复字总数
      wL[0], // 字词难度
      sL[2], // 句子难度
      q.theme,
      q.structure,
      q.languageFeature,
      q.backgroundKnowledge,
      0.2, // 篇幅权重
      0.1, // 不重复字总数权重
      0.1, // 字词难度权重
      0.1, // 句子难度权重,
      0.1, // 主题权重
      0.1, // 结构权重
      0.1, // 语言特点权重
      0.2 // 知识背景权重
    );
  } else if (q.type == "儿歌、儿童诗") {
    q.confidenceLevel = utils.getConfidenceLevel(
      // 改求置信度最高的级别时各个指标的权重
      q.type, // 文本类别
      q.lengthLevel, // 篇幅
      uL[0], // 不重复字总数
      wL[0], // 字词难度
      sL[2], // 句子难度
      q.theme,
      q.structure,
      q.languageFeature,
      q.backgroundKnowledge,
      0, // 篇幅权重
      0.1, // 不重复字总数权重
      0.1, // 字词难度权重
      0, // 句子难度权重,
      0.1, // 主题权重
      0.1, // 结构权重
      0.1, // 语言特点权重
      0.5 // 知识背景权重
    );
  } else if (q.type == "非连续文本") {
    q.confidenceLevel = utils.getConfidenceLevel(
      // 改求置信度最高的级别时各个指标的权重
      q.type, // 文本类别
      q.lengthLevel, // 篇幅
      uL[0], // 不重复字总数
      wL[0], // 字词难度
      sL[2], // 句子难度
      q.theme,
      q.structure,
      q.languageFeature,
      q.backgroundKnowledge,
      0.1, // 篇幅权重
      0.1, // 不重复字总数权重
      0.1, // 字词难度权重
      0, // 句子难度权重,
      0, // 主题权重
      0, // 结构权重
      0, // 语言特点权重
      0.7 // 知识背景权重
    );
  }

  //   console.log("--", q.confidenceLevel);
  //   q.pictureWeight = utils.getPictureWeightLevel(
  //     totalCount,
  //     jsonFile[i].pictureCount
  //   );
  _data.push(q);
}

utils.exportXlsx(_data, title, [
  "id",
  "VolumeTitle",
  "BookTitle",
  "isbn",
  "content",
  "type",
  // "grade",
  // "source",
  //   "theme",
  //   "structure",
  //   "languageFeature",
  //   "backgroundKnowledge",
  "pageWithWords",
  "countOnAverage",
  //   "countsPerPage",
  "countPerPage",
  "totalCount",
  "lengthLevel",
  "uniqueCount",
  "wordDifficulty",
  "sentenceDifficulty",
  //   "level1",
  //   "level2",
  //   "level3",
  //   "level4",
  //   "level5",
  //   "level6",
  //   "level7",
  //   "level8",
  "notInList",
  //   "resultLevel",
  //   "averageValue",
  "confidenceLevel",
]);
