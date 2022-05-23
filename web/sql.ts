export const SqlTypes = {
  DECIMAL: 0x00, // aka DECIMAL (http://dev.mysql.com/doc/refman/5.0/en/precision-math-decimal-changes.html)
  TINY: 0x01, // aka TINYINT, 1 byte
  SHORT: 0x02, // aka SMALLINT, 2 bytes
  LONG: 0x03, // aka INT, 4 bytes
  FLOAT: 0x04, // aka FLOAT, 4-8 bytes
  DOUBLE: 0x05, // aka DOUBLE, 8 bytes
  NULL: 0x06, // NULL (used for prepared statements, I think)
  TIMESTAMP: 0x07, // aka TIMESTAMP
  LONGLONG: 0x08, // aka BIGINT, 8 bytes
  INT24: 0x09, // aka MEDIUMINT, 3 bytes
  DATE: 0x0a, // aka DATE
  TIME: 0x0b, // aka TIME
  DATETIME: 0x0c, // aka DATETIME
  YEAR: 0x0d, // aka YEAR, 1 byte (don't ask)
  NEWDATE: 0x0e, // aka ?
  VARCHAR: 0x0f, // aka VARCHAR (?)
  BIT: 0x10, // aka BIT, 1-8 byte
  TIMESTAMP2: 0x11, // aka TIMESTAMP with fractional seconds
  DATETIME2: 0x12, // aka DATETIME with fractional seconds
  TIME2: 0x13, // aka TIME with fractional seconds
  JSON: 0xf5, // aka JSON
  NEWDECIMAL: 0xf6, // aka DECIMAL
  ENUM: 0xf7, // aka ENUM
  SET: 0xf8, // aka SET
  TINY_BLOB: 0xf9, // aka TINYBLOB, TINYTEXT
  MEDIUM_BLOB: 0xfa, // aka MEDIUMBLOB, MEDIUMTEXT
  LONG_BLOB: 0xfb, // aka LONGBLOG, LONGTEXT
  BLOB: 0xfc, // aka BLOB, TEXT
  VAR_STRING: 0xfd, // aka VARCHAR, VARBINARY
  STRING: 0xfe, // aka CHAR, BINARY
  GEOMETRY: 0xff, // aka GEOMETRY
};

export type SqlSelectReturn = {
  res: any[];
  fields: {
    name: string;
    type: keyof typeof SqlTypes;
  }[];
};

declare const electronApi: {
  call(event: string, ...args: any): void;
  get(event: string, ...args: any): Promise<any>;
  get(event: "sql", query: string): Promise<SqlSelectReturn>;
};

export async function getTables() {
  const { res } = await electronApi.get("sql", "SHOW TABLES;");
  const tables: string[] = [];

  res.forEach((entry: any) => {
    const keys = Object.keys(entry);

    if (keys.length !== 1) {
      throw new Error("Malicious format of `SHOW TABLES;` result.");
    }

    //@ts-ignore -- this can be done because we know that the given key is a key from the object we got by using Object.keys(...)
    tables.push(entry[keys.shift()]);
  });

  return tables;
}

export async function getTableEntries(table: string) {
  return (await resolveTableContent(table)).res.length;
}

export async function resolveTableContent<T>(table: string) {
  const { res, fields } = await electronApi.get(
    "sql",
    `SELECT * FROM ${table};`
  );
  return { res: res as T[], fields } as SqlSelectReturn;
}

export function fire(sql: string): Promise<void> {
  return new Promise((res, _) => {
    electronApi.call("sql", sql);
    res();
  });
}
