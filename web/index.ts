import * as constants from "./constants";
import { setupKeyHandler } from "./keyHandler";
import { setupConnectionForm } from "./ui/setupConnectionForm";

export type Connection = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

export let connection: Connection | null = null;

export function changeConnection(newConnection: Connection | null) {
  connection = newConnection;
}

constants.other.closeBtn.onclick = () => window.close();

setupConnectionForm();
setupKeyHandler();
