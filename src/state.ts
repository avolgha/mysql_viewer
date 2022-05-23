import sql from "mysql";

export let activeConnection: sql.Connection | undefined;

export function setConnection(connection: sql.Connection | undefined) {
  activeConnection = connection;
}
