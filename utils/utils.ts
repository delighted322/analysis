import * as XLSX from "xlsx";
import * as level from "./wordLevel";
import * as utils from "./utils";

// 判断这个字符是不是中文
export function isChinese(str: string) {
  let re = new RegExp("[\u4E00-\u9FA5]+");
  if (re.test(str)) return true;
  return false;
}

export function getTotalCountAndUniqueWords(
  content: string
): [number, Map<string, string>, any[]] {
  let totalCount = 0;
  let exist = new Map<string, string>();
  let temp = "";
  let newContent = [];

  for (let j = 0; j < content.length; j++) {
    if (utils.isChinese(content[j])) {
      totalCount += 1;
      if (!exist.has(content[j])) {
        exist.set(content[j], "1");
      }
    }
    temp += content[j];
    if (
      content[j] == "。" ||
      content[j] == "？" ||
      content[j] == "！" ||
      j == content.length - 1
    ) {
      if (utils.isChinese(temp)) {
        newContent.push(temp);
      }
      temp = "";
      continue;
    }
  }
  return [totalCount, exist, newContent];
}

export function getTotalCountLevel(
  totalCount: number,
  l1: number,
  l2: number,
  l3: number,
  l4: number
) {
  if (totalCount <= l1) {
    return "L1(" + totalCount + ")";
  } else if (totalCount <= l2) {
    return "L2(" + totalCount + ")";
  } else if (totalCount <= l3) {
    return "L3(" + totalCount + ")";
  } else if (totalCount <= l4) {
    //TODO: 按250和300各跑一遍
    return "L4(" + totalCount + ")";
  } else {
    return totalCount;
  }
}

export function getUniqueLevel(
  uniqueCount: number,
  l1: number,
  l2: number,
  l3: number,
  l4: number
) {
  if (uniqueCount <= l1) {
    return "L1(" + uniqueCount + ")";
  } else if (uniqueCount <= l2) {
    return "L2(" + uniqueCount + ")";
  } else if (uniqueCount <= l3) {
    return "L3(" + uniqueCount + ")";
  } else if (uniqueCount <= l4) {
    return "L4(" + uniqueCount + ")";
  } else {
    return uniqueCount;
  }
}

export function getwordDifficultyLevel(exist: Map<string, string>) {
  let wordDifficulty = "";

  let numInLevel1234 = 0;
  exist.forEach((value, key) => {
    if (
      (level.level1 + level.level2 + level.level3 + level.level4).indexOf(
        key
      ) != -1
    ) {
      numInLevel1234 += 1;
    }
  });
  let level4Percent = numInLevel1234 / exist.size;
  if (level4Percent > 0.7)
    wordDifficulty += "L4(" + level4Percent.toFixed(2) + ") ";

  let numInLevel123 = 0;
  exist.forEach((value, key) => {
    if ((level.level1 + level.level2 + level.level3).indexOf(key) != -1) {
      numInLevel123 += 1;
    }
  });
  let level3Percent = numInLevel123 / exist.size;
  if (level3Percent > 0.7)
    wordDifficulty += "L3(" + level3Percent.toFixed(2) + ") ";

  let numInLevel12 = 0;
  exist.forEach((value, key) => {
    if ((level.level1 + level.level2).indexOf(key) != -1) {
      numInLevel12 += 1;
    }
  });
  let level2Percent = numInLevel12 / exist.size;
  if (level2Percent > 0.7)
    wordDifficulty += "L2(" + level2Percent.toFixed(2) + ") ";

  let numInLevel1 = 0;
  exist.forEach((value, key) => {
    if (level.level1.indexOf(key) != -1) {
      numInLevel1 += 1;
    }
  });
  let level1Percent = numInLevel1 / exist.size;
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

export function getSentenceDifficulty(
  totalCount: number,
  content: any[],
  l1: number,
  l2: number,
  l3: number,
  l4: number
) {
  let sentenceDifficulty = totalCount / content.length;
  if (sentenceDifficulty <= l1) {
    return "L1(" + sentenceDifficulty.toFixed(2) + ")";
  } else if (sentenceDifficulty <= l2) {
    return "L2(" + sentenceDifficulty.toFixed(2) + ")";
  } else if (sentenceDifficulty <= l3) {
    return "L3(" + sentenceDifficulty.toFixed(2) + ")";
  } else if (sentenceDifficulty <= l4) {
    return "L4(" + sentenceDifficulty.toFixed(2) + ")";
  } else {
    return Math.round(sentenceDifficulty);
  }
}

// 每页平均字数
export function getCountOnAverageLevel(
  totalCount: number,
  pageWithWords: number
) {
  let result = totalCount / pageWithWords;
  if (result <= 10) return "L1(" + result.toFixed(2) + ")"; // TODO: 这里是小于还是小于等于
  if (result <= 20) return "L2(" + result.toFixed(2) + ")";
  if (result <= 30) return "L2(" + result.toFixed(2) + ")";
  if (result <= 40) return "L2(" + result.toFixed(2) + ")";
}

// 篇幅
export function getCountPerPageLevel(
  contentArray: string[],
  pageWithWords: number
) {
  let countL1 = 0;
  let countL2 = 0;
  let countL3 = 0;
  let countL4 = 0;
  let tempCount = 0;
  let countPerPage = "";

  for (let i = 1; i < contentArray.length; i++) {
    tempCount = getTotalCountAndUniqueWords(contentArray[i])[0];
    if (tempCount <= 10) countL1 += 1;
    if (tempCount <= 20) countL2 += 1;
    if (tempCount <= 30) countL3 += 1;
    if (tempCount <= 40) countL4 += 1;
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

// 图片信息占比
export function getPictureWeightLevel(
  totalCount: number,
  pictureCount: number
) {
  let weight = totalCount / pictureCount;
  if (weight <= 10) return "L1(" + weight.toFixed(2) + ")";
  if (weight <= 20) return "L2(" + weight.toFixed(2) + ")";
  if (weight <= 25) return "L3(" + weight.toFixed(2) + ")";
  if (weight <= 30) return "L4(" + weight.toFixed(2) + ")";
  return weight;
}

// 导出表格
export function exportXlsx(_data: any[], title: string, columNames: string[]) {
  const _headers = columNames;

  const headers = _headers
    .map((v: any, i: any) =>
      Object.assign({ v: v, position: String.fromCharCode(65 + i) + 1 })
    )
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, { [next.position]: { v: next.v } }),
      {}
    );

  const data = _data
    .map((v: any, i: any) =>
      _headers.map((k, j) =>
        Object.assign(
          {},
          { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) }
        )
      )
    )
    .reduce((prev, next) => prev.concat(next))
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, { [next.position]: { v: next.v } }),
      {}
    );

  const output = Object.assign({}, headers, data);

  const outputPos = Object.keys(output);

  const ref = outputPos[0] + ":" + outputPos[outputPos.length - 1];

  const wb = {
    SheetNames: ["Sheet1"],
    Sheets: {
      Sheet1: Object.assign({}, output, { "!ref": ref })
    }
  };

  XLSX.writeFile(wb, title + ".xlsx");
}
