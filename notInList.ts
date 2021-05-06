import { count } from "console";
//  跑不在字库里的字的字频

import * as fs from "fs";
import * as YAML from "yaml";

import * as utils from "./utils/utils";

const title = "不在字表内的字";
const file = fs.readFileSync("./src/yml/" + title + ".yml", "utf8");
let jsonFile = YAML.parse(file);

let _data = [];
let notInListFrequency = new Map<string, number>();

for (var i = 0; i < jsonFile.length; i++) {
  let content = jsonFile[i].content;

  for (let s of content) {
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
notInListFrequency.forEach((value, key) => {
  let q: any = {};
  q.word = key;
  q.frequency = value;
  _data.push(q);
});

utils.exportXlsx(_data, title, ["word", "frequency"]);
