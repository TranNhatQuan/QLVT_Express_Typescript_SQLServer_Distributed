import "reflect-metadata";
import { App } from "./app";
import { config } from "./configs";

const app = new App(config, [
  {
    version: "",
    groups: [
      {
        routes: [],
      },
    ],
  },
  {
    version: "v1",
    groups: [
      {
        group: "portal",
        routes: [],
      },
      {
        routes: [],
      },
    ],
  },
]);
app.start();
