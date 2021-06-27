import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { addApp, removeApp, list } from "./providers/apps";

const api = (stream: WindowPostMessageStream, data: any) => {
  console.log("api request", data);

  switch (data.type + "/" + data.method) {
    case "apps/addApp":
      addApp(data.args[0]);
      // @ts-ignore
      stream.write({
        id: data.id,
      })
      break
    case "apps/removeApp":
      removeApp(data.args[0]);
      // @ts-ignore
      stream.write({
        id: data.id,
      })
      break
    case "apps/list":
      // @ts-ignore
      stream.write({
        id: data.id,
        res: list()
      })
      break
  }
}

export default api;
