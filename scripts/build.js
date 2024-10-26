import { execSync } from "child_process";
import { cpSync, rmSync } from "fs";
import path from "path";

const outputPath = path.join(process.cwd(), "build");
const inputAssetsPath = path.join(process.cwd(), "assets");
const outputAssetsPath = path.join(outputPath, "assets");

rmSync(outputPath, { recursive: true, force: true });
execSync("tsc");
cpSync(inputAssetsPath, outputAssetsPath, { recursive: true });
