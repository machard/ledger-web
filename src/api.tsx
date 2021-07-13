import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { addApp, removeApp, list } from "./providers/apps";
import appsData from "./apps.json";

const api = async (stream: WindowPostMessageStream, data: any) => {
  console.log("lw api request", data);

  switch (data.type + "/" + data.method) {
    case "apps/data":
      stream.write({
        id: data.id,
        res: appsData
      });
      break
    case "apps/addApp":
      addApp(data.args[0]);
      stream.write({
        id: data.id,
      })
      break
    case "apps/removeApp":
      removeApp(data.args[0]);
      stream.write({
        id: data.id,
      })
      break
    case "apps/list":
      stream.write({
        id: data.id,
        res: list()
      })
      break
  }
}

export default api;
