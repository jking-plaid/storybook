import { readStory } from './dependencies-lookup/readAsObject';

export async function transform(inputSource) {
  const sourceObject = await readStory(this, inputSource);

  // if source-loader had trouble parsing the story exports, return the original story
  // example is
  // const myStory = () => xxx
  // export { myStory }
  if (!sourceObject.source || sourceObject.source.length === 0) {
    return inputSource;
  }

  const { source, sourceJson, addsMap } = sourceObject;

  const preamble = `
    /* eslint-disable */
    // @ts-nocheck
    // @ts-expect-error (Converted from ts-ignore)
    var __STORY__ = ${sourceJson};
    // @ts-expect-error (Converted from ts-ignore)
    var __LOCATIONS_MAP__ = ${JSON.stringify(addsMap, null, 2).trim()};
    `;
  return `${preamble}\n${source}`;
}
