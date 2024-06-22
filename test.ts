import * as Files from "./src/Files";


(async () => {
    await Files.WithWriteStream("./data/Test.txt", async (stream) => {
        await stream.write("Test 1\n");
        await stream.write("Test 2\n");
        await stream.write("Test 3\n");
        await stream.write("\n");
        return null;
    });
    await Files.WithAppendStream("./data/Test.txt", async (stream) => {
        await stream.write("Test 1\n");
        await stream.write("Test 2\n");
        await stream.write("Test 3\n");
        await stream.write("\n");
        return null;
    });
    const data = await Files.ReadFile("./data/Test.txt");
    console.log(data.toString());
})();