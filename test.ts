import * as Files from "./src/Files";


(async () => {
    const files = await Files.GetDescendants(Files.ROOT + "\\build", (x) => x.endsWith(".js"));
    console.log(files);
})();