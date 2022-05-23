import sql from "mysql";
import { timeStamp } from "../util";

export default function validateConnection(_: any, ...args: any[]) {
  return new Promise<boolean>((res, _) => {
    const connection = args[0][0];

    const con = sql.createConnection({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    });

    con.connect((err) => {
      con.destroy();

      if (err) {
        console.log({
          connection,
          err: err.sqlMessage,
          code: err.code,
          timestamp: timeStamp(false),
        });

        res(false);
      } else {
        res(true);
      }
    });
  });
}
