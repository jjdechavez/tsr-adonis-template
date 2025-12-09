import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

(async () => {
  console.log("🚀 Initializing new Monorepo...");

  const projectName = await question(
    "What is the project name (e.g., my-saas)? ",
  );
  const scopeName = await question("What is the scope name (e.g., @org)? ");

  const fullServerName = `${scopeName}/server`;
  const fullWebName = `${scopeName}/web`;

  updateJson("apps/server/package.json", (json) => {
    json.name = fullServerName;
  });

  updateJson("apps/web/package.json", (json) => {
    json.name = fullWebName;
    if (json.dependencies) {
      // Remove old ref and add new one
      const oldKeys = Object.keys(json.dependencies).filter((k) =>
        k.includes("/server"),
      );
      oldKeys.forEach((k) => delete json.dependencies[k]);
      json.dependencies[fullServerName] = "workspace:*";
    }
  });

  updateJson("package.json", (json) => {
    json.name = projectName;
  });

  console.log(`\n✅ Renamed packages to ${fullServerName} and ${fullWebName}`);
  console.log(`👉 Run 'pnpm install' to link the workspaces.`);

  rl.close();
})();

function updateJson(filePath, updateFn) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    updateFn(content);
    fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));
  }
}
