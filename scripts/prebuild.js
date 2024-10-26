import { execSync } from "child_process";
import { writeFileSync } from "fs";
import path from "path";

const command = "npm pkg get version | xargs";

const version = execSync(command, { encoding: "utf-8" }).replace("\n", "");

const filePath = path.join(process.cwd(), "src", "version.ts");

const fileContent = `export const version = "${version}";`;

writeFileSync(filePath, fileContent);
