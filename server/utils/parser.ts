//https://github.com/kcwiki/lua-json
import { parse as parseLua } from "luaparse";

const isNull = (value: unknown) => value === null;
const isString = (value: unknown) => typeof value === "string";
const isArray = (value: unknown) => Array.isArray(value);
const isObject = (value: unknown) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isEmpty = (value: unknown) => {
  if (isNull(value)) return true;
  if (isArray(value) || isString(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

function luaAstToJson(ast) {
  // literals
  if (["NilLiteral", "BooleanLiteral", "NumericLiteral"].includes(ast.type)) {
    return ast.value;
  }
  if (ast.type === "StringLiteral") {
    // Remove the quotes from the string literal
    return ast.raw.slice(1, -1);
  }
  if (ast.type === "Identifier") {
    // basic expressions
    return ast.name;
  }

  // Handle logical expressions (OR operator)
  if (ast.type === "LogicalExpression" && ast.operator === "or") {
    // Return an array with both the left and right values
    return [luaAstToJson(ast.left), luaAstToJson(ast.right)];
  }
  // tables
  if (["TableKey", "TableKeyString"].includes(ast.type)) {
    return {
      __internal_table_key: true,
      key: luaAstToJson(ast.key),
      value: luaAstToJson(ast.value),
    };
  }
  if (ast.type === "TableValue") {
    return luaAstToJson(ast.value);
  }
  if (ast.type === "TableConstructorExpression") {
    if (ast.fields[0] && ast.fields[0].key) {
      const object = Object.fromEntries(
        ast.fields.map((field) => {
          const { key, value } = luaAstToJson(field);
          return [key, value];
        }),
      );
      return isEmpty(object) ? [] : object;
    }
    return ast.fields.map((field) => {
      const value = luaAstToJson(field);
      return value.__internal_table_key ? [value.key, value.value] : value;
    });
  }
  // top-level statements, only looking at the first statement, either return or local
  // todo: filter until return or local?
  if (ast.type === "LocalStatement") {
    const values = ast.init.map(luaAstToJson);
    return values.length === 1 ? values[0] : values;
  }
  if (ast.type === "ReturnStatement") {
    const values = ast.arguments.map(luaAstToJson);
    return values.length === 1 ? values[0] : values;
  }
  if (ast.type === "Chunk") {
    return luaAstToJson(ast.body[0]);
  }
  throw new Error(`can't parse ${ast.type}`);
}

export const parse = (value: string) =>
  luaAstToJson(parseLua(value, { comments: false }));
