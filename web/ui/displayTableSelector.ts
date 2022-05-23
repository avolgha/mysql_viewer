import * as constants from "../constants";
import { getTableEntries, getTables, resolveTableContent } from "../sql";
import { sortTablesForDisplay, transformToArray } from "../util";
import { displayTable } from "./displayTable";

export async function displayTableSelector() {
  const rawTables = await getTables();
  const tables = sortTablesForDisplay(rawTables);

  constants.other.tableContainer.innerHTML = ``;

  tables.forEach((tableRow) => {
    const row = constants.createElement({
      tag: "div",
      class: ["row"],
      childs: tableRow.map((table) => {
        return constants.createElement({
          tag: "div",
          class: ["col-sm-6"],
          childs: [
            constants.createElement({
              tag: "button",
              class: ["card-handle"],
              childs: [
                constants.createElement({
                  tag: "div",
                  id: "table-" + table,
                  attributes: {
                    style: [
                      "border: 1px solid white",
                      "color: white",
                      "background-color: transparent",
                    ].join("; "),
                  },
                  class: ["card"],
                  childs: [
                    constants.createElement({
                      tag: "div",
                      class: ["card-body"],
                      childs: [
                        constants.createElement({
                          tag: "h5",
                          class: ["card-title"],
                          childs: [document.createTextNode(table)],
                        }),
                        constants.createElement({
                          tag: "p",
                          class: ["card-text"],
                          childs: [
                            document.createTextNode("loading table data..."),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }),
    });

    constants.other.tableContainer.appendChild(row);
  });

  transformToArray(document.getElementsByClassName("card-handle"))
    .map((e) => e as HTMLElement)
    .forEach((button) => {
      const tableName = button.children[0].id.split("-")[1];
      button.onclick = () => {
        constants.loadScreen("table", "waiting");

        resolveTableContent(tableName).then((content) =>
          displayTable(tableName, content)
        );
      };
    });

  constants.loadScreen("waiting", "table");

  rawTables.forEach((table) => {
    getTableEntries(table).then((entries) => {
      const textElement = constants.e(
        "#table-" + table + " > .card-body > p.card-text"
      );

      textElement.innerHTML = entries === 1 ? `1 entry` : `${entries} entries`;
    });
  });
}
