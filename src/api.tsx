import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { addApp, removeApp, list } from "./providers/apps";
import { setModal } from "./providers/modals";
import RequireApp from "./modals/RequireApp";

const api = (stream: WindowPostMessageStream, data: any) => {
  console.log("api request", data);

  switch (data.type + "/" + data.method) {
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

    case "devices/requireApp":
      setModal(RequireApp, {
        handleCancel: () => {
          setModal();
          stream.write({
            id: data.id,
            err: "cancelled"
          })
        },
        handleSuccess: () => {
          setModal();
          stream.write({
            id: data.id,
            res: "success"
          })
        },
        app: data.args[0]
      });
      break
  }
}

export default api;
