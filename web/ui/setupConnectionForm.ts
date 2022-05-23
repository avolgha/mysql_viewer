import * as constants from "../constants";
import { changeConnection, Connection, connection } from "..";
import { displayTableSelector } from "./displayTableSelector";

declare const electronApi: {
  call(event: string, ...args: any): void;
  get(event: string, ...args: any): Promise<any>;
  get(event: "validate-connection", connection: Connection): Promise<boolean>;
};

export function setupConnectionForm() {
  const { host, port, database, username, password, submit, container } =
    constants.connectionForm;

  function checkConnectionFormComplete() {
    return (
      host.value.trim() !== "" &&
      port.value.trim() !== "" &&
      database.value.trim() !== "" &&
      username.value.trim() !== "" &&
      password.value.trim() !== ""
    );
  }

  submit.onclick = () => {
    changeConnection({
      host: host.value,
      port: parseInt(port.value),
      database: database.value,
      username: username.value,
      password: password.value,
    });

    constants.loadScreen("connectionForm", "waiting");

    electronApi.get("validate-connection", connection).then((result) => {
      host.value = "";
      port.value = "3306";
      database.value = "";
      username.value = "";
      password.value = "";
      if (result) {
        electronApi.call("establish-connection", connection);

        setTimeout(async () => {
          await displayTableSelector();
        }, 1000);
      } else {
        constants.loadScreen("waiting", "connectionForm");
        const alert = document.createElement("alert");
        alert.classList.add(
          "alert",
          "alert-danger",
          "alert-dismissible",
          "fade",
          "show"
        );
        alert.setAttribute("role", "alert");
        alert.appendChild(
          document.createTextNode(
            "Please check your credentials. The database does not exists or the credentials are false."
          )
        );
        const dismiss = document.createElement("button");
        dismiss.type = "button";
        dismiss.classList.add("btn-close");
        dismiss.setAttribute("data-bs-dismiss", "alert");
        dismiss.ariaLabel = "Close";
        alert.appendChild(dismiss);
        container.insertBefore(alert, container.firstChild);
      }
    });
  };

  [host, port, database, username, password].forEach(
    (input) =>
      (input.onchange = () => (submit.disabled = !checkConnectionFormComplete))
  );
}
