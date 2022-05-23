import sql from "mysql";
import { activeConnection } from "../state";

export default function sqlHandler(_: any, ...args: any[]) {
  return new Promise<{
    res: any;
    fields: sql.FieldInfo[] | undefined;
  }>((res, rej) => {
    const sql: string = args[0][0];

    if (!sql) {
      rej(new Error("The SQL query must be supplied in the arguments."));
      return;
    }

    if (!activeConnection) {
      rej(
        new Error(
          "Cannot send query to inactive connection. Please establish the connection first."
        )
      );
      return;
    }

    activeConnection!.ping((err) => {
      if (err) {
        rej(err);
        return;
      }

      activeConnection!.query(sql, (err, results, fields) => {
        if (err) {
          rej(err);
          return;
        }

        res({
          res: results,
          fields,
        });
      });
    });
  });
}
