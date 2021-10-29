const axios = require("axios");

const security = require("./security");

const signingSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;

exports.handler = (event, context, callback) => {
  if (security.validateSlackRequest(event, signingSecret)) {
    const body = JSON.parse(event.body);
    switch (body.type) {
      case "url_verification":
        callback(null, body.challenge);
        break;

      case "event_callback":
        processRequest(body, callback);
        break;
      default:
        callback(null);
    }
  } else callback("verification failed");
};

const processRequest = (body, callback) => {
  console.debug("eventType =>", body.event.type);
  const message = {
    channel: body.event.channel,
    text: `Evento ${body.event.type}`,
  };

  if (body.event.type !== "message") {
    axios({
      method: "post",
      url: "https://slack.com/api/chat.postMessage",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      data: message,
    });
  }

  switch (body.event.type) {
    case "message":
      processMessages(body, callback);
      break;
    case "app_mention":
      processAppMention(body, callback);
    default:
      callback(null);
  }
};

const processMessages = (body, callback) => {
  console.debug("update:", "updated");
  console.debug("message:", body.event.text);
  console.debug("channel:", body.event.channel);
  console.debug("token:", token);

  const message = {
    channel: body.event.channel,
    text: `Hola desde lambda`,
    attachments: [
      {
        text: "Choose a game to play",
        fallback: "You are unable to choose a game",
        callback_id: "wopr_game",
        color: "#3AA3E3",
        attachment_type: "default",
        actions: [
          {
            name: "game",
            text: "Chess",
            type: "button",
            value: "chess",
          },
          {
            name: "game",
            text: "Falken's Maze",
            type: "button",
            value: "maze",
          },
          {
            name: "game",
            text: "Thermonuclear War",
            style: "danger",
            type: "button",
            value: "war",
            confirm: {
              title: "Are you sure?",
              text: "Wouldn't you prefer a good game of chess?",
              ok_text: "Yes",
              dismiss_text: "No",
            },
          },
        ],
      },
    ],
  };
  //axios({
  //  method: "post",
  //  url: "https://slack.com/api/chat.postMessage",
  //  headers: {
  //    "Content-Type": "application/json; charset=utf-8",
  //    Authorization: `Bearer ${token}`,
  //  },
  //  data: message,
  //})
  //  .then((response) => {
  //    callback(null);
  //    console.debug("response:", "hubo respuesta");
  //  })
  //  .catch((error) => {
  //    console.debug("error:", error);
  //    console.debug("error:", error.message);
  //  });
};

const processAppMention = (body, callback) => {
  console.debug("update:", "updated");
  console.debug("message:", body.event.text);
  console.debug("channel:", body.event.channel);
  console.debug("token:", token);

  const message = {
    channel: body.event.channel,
    text: `Hola desde lambda`,
    attachments: [
      {
        text: "Choose a game to play",
        fallback: "You are unable to choose a game",
        callback_id: "wopr_game",
        color: "#3AA3E3",
        attachment_type: "default",
        actions: [
          {
            name: "game",
            text: "Chess",
            type: "button",
            value: "chess",
          },
          {
            name: "game",
            text: "Falken's Maze",
            type: "button",
            value: "maze",
          },
          {
            name: "game",
            text: "Thermonuclear War",
            style: "danger",
            type: "button",
            value: "war",
            confirm: {
              title: "Are you sure?",
              text: "Wouldn't you prefer a good game of chess?",
              ok_text: "Yes",
              dismiss_text: "No",
            },
          },
        ],
      },
    ],
  };
  axios({
    method: "post",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    data: message,
  })
    .then((response) => {
      callback(null);
      console.debug("response:", "hubo respuesta");
    })
    .catch((error) => {
      console.debug("error:", error);
      console.debug("error:", error.message);
    });
};
