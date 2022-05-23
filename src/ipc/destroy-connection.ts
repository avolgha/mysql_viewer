import { activeConnection, setConnection } from "../state";

export default function destroyConnection() {
  if (!activeConnection) {
    return;
  }

  activeConnection.destroy();
  setConnection(undefined);
}
