import { Command } from "commander";

const program = new Command();

program.option(
  "--mode <mode>",
  "Especificar el entorno de ejecución de nuestro servidor",
  "development"
);

program.parse();

export default program;
