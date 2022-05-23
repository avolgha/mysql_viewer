export function e<T extends HTMLElement>(query: string) {
  return document.querySelector(query)! as T;
}

export function i(query: string) {
  return e<HTMLInputElement>(query);
}

export function createElement(options: {
  tag: string;
  id?: string;
  class?: string[];
  attributes?: { [key: string]: string };
  childs?: Node[];
}) {
  const element = document.createElement(options.tag);
  options.id && (element.id = options.id);
  options.class && element.classList.add(...options.class);
  options.attributes &&
    Object.keys(options.attributes).forEach((key) => {
      element.setAttribute(key, options.attributes![key]);
    });
  options.childs &&
    options.childs.forEach((child) => element.appendChild(child));
  return element;
}

export const classes = {
  activeScreen: "screen-active",
};

export const other = {
  closeBtn: e("#control-bar > span"),
  controlBar: e("#control-bar"),
  tableContainer: e("#table-screen > main"),
};

export const screens: { [name: string | "nothing" | "waiting"]: HTMLElement } =
  {
    nothing: e("#nothing-screen"),
    connectionForm: e("#main-screen"),
    waiting: e("#waiting-screen"),
    table: e("#table-screen"),
    viewer: e("#viewer-screen"),
  };

export const connectionForm = {
  container: screens.connectionForm,
  host: i("#connect-host"),
  port: i("#connect-port"),
  database: i("#connect-database"),
  username: i("#connect-user"),
  password: i("#connect-password"),
  submit: i("#connect-submit"),
};

export const tableViewer = {
  database: e("#viewer-db"),
  table: e("#viewer-table"),
  head: e("#viewer-screen > main > .table > thead > tr"),
  body: e("#viewer-screen > main > .table > tbody"),
};

export function loadScreen(
  old: HTMLElement | string,
  next: HTMLElement | string
) {
  if (typeof old === "string") {
    old = screens[old];
  }
  if (typeof next === "string") {
    next = screens[next] || screens.nothing;
  }
  old.classList.remove(classes.activeScreen);
  next.classList.add(classes.activeScreen);
}
