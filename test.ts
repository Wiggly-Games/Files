import * as Files from "./src/Files";


(async () => {
    await Files.WithWriteStream("./data/Test.txt", async (stream) => {
        await stream.write("Test 1");
        await stream.write("Test 2");
        await stream.write("Test 3");
        return null;
    })
    const data = await Files.ReadFile("./data/Test.txt");
    console.log(data.toString());
})();