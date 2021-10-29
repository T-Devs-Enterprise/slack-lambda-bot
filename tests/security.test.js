const security = require("../security");
const event = require("./event.json");

test("validate slack request", () => {
  const signingSecret = "389400f302c06a548f99d9802ed58ab7";
  expect(security.validateSlackRequest(event, signingSecret)).toBe(true);
});
``;
