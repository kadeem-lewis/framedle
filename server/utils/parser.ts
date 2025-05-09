//https://github.com/kcwiki/lua-json
import { parse as parseLua } from "luaparse";
import type {
  NilLiteral,
  Node,
  NumericLiteral,
  BooleanLiteral,
  StringLiteral,
  Identifier,
  LogicalExpression,
  TableValue,
  TableKey,
  TableKeyString,
  TableConstructorExpression,
  LocalStatement,
  ReturnStatement,
  Chunk,
} from "luaparse";

type LuaJson =
  | string
  | number
  | boolean
  | null
  | LuaJson[]
  | { [key: string]: LuaJson };

type TableKeyResult = {
  __internal_table_key: true;
  key: LuaJson;
  value: LuaJson;
};

const isEmpty = (value: unknown) => {
  if (value === null) return true;
  if (Array.isArray(value) || typeof value === "string")
    return value.length === 0;
  if (Object.getPrototypeOf(value) === Object.prototype)
    return value && Object.keys(value).length === 0;
  return false;
};

const isTableKeyNode = (node: Node): node is TableKey | TableKeyString =>
  node.type === "TableKey" || node.type === "TableKeyString";

const isTableKeyResult = (value: unknown): value is TableKeyResult =>
  value !== null &&
  typeof value === "object" &&
  "__internal_table_key" in (value as object);

function luaAstToJson(ast: Node): LuaJson {
  // literals
  if (["NilLiteral", "BooleanLiteral", "NumericLiteral"].includes(ast.type)) {
    return (ast as NilLiteral | BooleanLiteral | NumericLiteral).value;
  }
  if (ast.type === "StringLiteral") {
    // Remove the quotes from the string literal
    return (ast as StringLiteral).raw.slice(1, -1);
  }
  if (ast.type === "Identifier") {
    // basic expressions
    return (ast as Identifier).name;
  }

  // Handle logical expressions (OR operator)
  if (ast.type === "LogicalExpression" && ast.operator === "or") {
    const expression = ast as LogicalExpression;
    return [luaAstToJson(expression.left), luaAstToJson(expression.right)];
  }
  // tables
  if (["TableKey", "TableKeyString"].includes(ast.type)) {
    const keyNode = ast as TableKey | TableKeyString;
    return {
      __internal_table_key: true,
      key: luaAstToJson(keyNode.key),
      value: luaAstToJson(keyNode.value),
    };
  }
  if (ast.type === "TableValue") {
    return luaAstToJson((ast as TableValue).value);
  }
  if (ast.type === "TableConstructorExpression") {
    const tableNode = ast as TableConstructorExpression;
    if (tableNode.fields[0] && isTableKeyNode(tableNode.fields[0])) {
      const object: { [key: string]: LuaJson } = {};

      for (const field of tableNode.fields) {
        const processedField = luaAstToJson(field);
        if (isTableKeyResult(processedField)) {
          const keyStr = String(processedField.key);
          object[keyStr] = processedField.value;
        }
      }

      return isEmpty(object) ? [] : object;
    }
    return tableNode.fields.map((field) => {
      const value = luaAstToJson(field);
      return isTableKeyResult(value) ? [value.key, value.value] : value;
    });
  }

  // top-level statements, only looking at the first statement, either return or local
  if (ast.type === "LocalStatement") {
    const values = (ast as LocalStatement).init.map(luaAstToJson);
    return values.length === 1 ? values[0] : values;
  }
  if (ast.type === "ReturnStatement") {
    const values = (ast as ReturnStatement).arguments.map(luaAstToJson);
    return values.length === 1 ? values[0] : values;
  }
  if (ast.type === "Chunk") {
    return luaAstToJson((ast as Chunk).body[0]);
  }
  throw createError(`can't parse ${ast.type}`);
}

export const parse = (value: string) =>
  luaAstToJson(parseLua(value, { comments: false }));
