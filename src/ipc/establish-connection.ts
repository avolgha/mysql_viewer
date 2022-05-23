import sql from "mysql";
import { activeConnection, setConnection } from "../state";

export default function establishConnection(_: any, ...args: any[]) {
  const connection = args[0][0];

  if (activeConnection) {
    throw new Error("Cannot establish connection twice.");
  }

  setConnection(
    sql.createConnection({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
    })
  );

  activeConnection!.connect();
}
