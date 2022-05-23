export function setupKeyHandler() {
  // TODO(1.1): add key handler for table viewer actions: add, edit, delete

  document.onkeydown = (event) => {
    if (event.altKey && event.key === "r") {
      //@ts-ignore
      window.location.reload(false);
      //@ts-ignore
      electronApi.call("destroy-connection");
    }

    if (event.altKey && event.key === "q") {
      window.close();
    }
  };
}
