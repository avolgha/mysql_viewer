import * as constants from "../constants";
import { displayTableSelector } from "./displayTableSelector";
import { SqlSelectReturn, SqlTypes } from "../sql";
import { timeStamp } from "../util";
import { connection } from "..";

export function displayTable(table: string, content: SqlSelectReturn) {
  constants.tableViewer.database.innerText = connection!.database;
  constants.tableViewer.table.innerText = table;

  ["(idx)", ...content.fields.map((field) => field.name)]
    .map((name) => {
      return constants.createElement({
        tag: "th",
        attributes: {
          scope: "col",
        },
        childs: [document.createTextNode(name)],
      });
    })
    .forEach((node) => constants.tableViewer.head.appendChild(node));

  content.res
    .map((value, idx) => {
      return constants.createElement({
        tag: "tr",
        childs: [
          constants.createElement({
            tag: "th",
            attributes: {
              scope: "row",
            },
            childs: [document.createTextNode(idx.toString())],
          }),
          ...Object.keys(value).map((key, nidx) => {
            let fieldType = SqlTypes[content.fields[nidx].type];
            let text = value[key];

            if (fieldType === SqlTypes.DATE) {
              const date = new Date(text);
              text = timeStamp(date);
            }

            return constants.createElement({
              tag: "td",
              childs: [document.createTextNode(text)],
            });
          }),
        ],
      });
    })
    .forEach((node) => constants.tableViewer.body.appendChild(node));

  const backButton = constants.createElement({
    tag: "span",
    childs: [document.createTextNode("Back")],
  });

  backButton.onclick = () => {
    constants.loadScreen("viewer", "waiting");
    constants.tableViewer.body.innerHTML = ``;
    constants.tableViewer.head.innerHTML = ``;
    constants.tableViewer.database.innerHTML = `&lt;DB&gt;`;
    constants.tableViewer.table.innerHTML = `&lt;TABLE&gt;`;

    constants.other.controlBar.removeChild(backButton);
    displayTableSelector();
  };

  constants.other.controlBar.appendChild(backButton);

  constants.loadScreen("waiting", "viewer");

  // TODO(1.1): Add buttons to edit, delete and add
}
