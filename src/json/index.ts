/**
 * @copyright 2020 Yogesh Sajanikar
 */

import {JSONPath} from 'jsonpath-plus';

type JSONPathMap = {
  path: string;
  key: string;
  result: number | boolean | string | object[] | object;
};

export function jsonPathNumber(path: string, key: string): JSONPathMap {
  return {
    path: path,
    key: key,
    result: 0.0,
  };
}

export function jsonPathString(path: string, key: string): JSONPathMap {
  return {
    path: path,
    key: key,
    result: 'string',
  };
}

export function jsonPathBoolean(path: string, key: string): JSONPathMap {
  return {
    path: path,
    key: key,
    result: true,
  };
}

export function jsonPathObjectArray(path: string, key: string): JSONPathMap {
  return {
    path: path,
    key: key,
    result: [],
  };
}

export function jsonPathObject(path: string, key: string): JSONPathMap {
  return {
    path: path,
    key: key,
    result: {},
  };
}

type JSONPathResult = {
  [key: string]: number | boolean | string | object[] | object;
};

type JSONPathTranformFunction = (
  v: number | boolean | string | object[] | object
) => JSONPathResult;

function jsonFieldTranform(
  value: JSONPathMap,
  input: number | boolean | string | object[] | object
): JSONPathResult {
  const result = JSONPath({path: value.path, json: input});
  const resultType = typeof value.result;
  switch (resultType) {
    case 'number':
      return {[value.key]: Number.parseFloat(result)};
    case 'string':
      return {[value.key]: String(result)};
    case 'boolean':
      return {[value.key]: /true/i.test(result)};
    case 'object':
    default:
      return {[value.key]: value.result};
  }
}

function mergeJsonPathResult(
  a: JSONPathResult,
  b: JSONPathResult
): JSONPathResult {
  return {...a, ...b};
}

export function jsonTransform(
  ...pathMaps: JSONPathMap[]
): JSONPathTranformFunction {
  return (input: number | boolean | string | object[] | object) => {
    return pathMaps
      .map(value => jsonFieldTranform(value, input))
      .reduce(mergeJsonPathResult, {});
  };
}
