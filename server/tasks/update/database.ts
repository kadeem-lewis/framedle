export default defineTask({
  meta: {
    name: "update:database",
    description: "Update the database based on local data",
  },
  async run() {
    await runTask("generate:categories");
    await runTask("generate:pairs");

    await runTask("generate:queue");

    return {
      result: "Success",
    };
  },
});
