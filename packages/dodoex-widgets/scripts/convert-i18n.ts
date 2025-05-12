import fs from 'fs';
import gettextParser from 'gettext-parser';

function main() {
  const filename = './src/locales/zh-CN.po';
  const file = fs.readFileSync(filename);
  const po = gettextParser.po.parse(file);
  const translations = po.translations[''];
  const enObject = getENObject();

  Object.entries<any>(translations).forEach(([key, value]) => {
    if (Array.isArray(value.msgstr) && !value.msgstr[0]) {
      const enKeys = enObject[key];
      if (enKeys) {
        if (enKeys.length === 1) {
          const zhText = getZHText(enKeys[0]);
          if (zhText) {
            value.msgstr[0] = zhText;
          }
        } else {
          console.log(JSON.stringify(enKeys), '\n');
        }
      }
    }
  });
  const output = gettextParser.po.compile(po, {
    foldLength: 0,
    escapeCharacters: false,
  });
  fs.writeFileSync(filename, output);
}

function getENObject() {
  const enJsonString = fs.readFileSync('./test/en.json');
  const enJson = JSON.parse(enJsonString.toString());
  const result: { [key: string]: string[] } = {};
  const zhJsonString = fs.readFileSync('./test/zh.json');
  const zhJson = JSON.parse(zhJsonString.toString());

  Object.entries<string>(enJson).forEach(([key, value]) => {
    if (
      key.startsWith('cp.') ||
      key.startsWith('ido.') ||
      key.startsWith('v3.')
    )
      return;
    if (!result[value]) {
      result[value] = [key];
    } else {
      const currentZHValue = zhJson[key];
      const isMatch = result[value].some(
        (oldKey) => currentZHValue === zhJson[oldKey],
      );
      if (!isMatch) {
        result[value].push(key);
      }
    }
  });
  return result;
}

function getZHText(key: string) {
  const zhJsonString = fs.readFileSync('./test/zh.json');
  const zhJson = JSON.parse(zhJsonString.toString());
  return zhJson[key] as string | undefined;
}

main();
