import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { addApp, removeApp, list } from "./providers/apps";
import { getTransport } from "./providers/devices";
import { setModal } from "./providers/modals";
import RequireApp from "./modals/RequireApp";
import RequireDeviceAction from './modals/RequireDeviceAction';

const api = async (stream: WindowPostMessageStream, data: any) => {
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

    case "devices/requireDeviceActionStart":
      setModal(RequireDeviceAction, {});
      stream.write({
        id: data.id,
        res: "success"
      })
      break
    case "devices/requireDeviceActionEnd":
      setModal();
      stream.write({
        id: data.id,
        res: "success"
      })
      break

    case "devices/send":
      const transport = getTransport();
      if (!transport) {
        return stream.write({
          id: data.id,
          err: "no transport"
        })
      }

      if (data.args[4]) {
        data.args[4] = Buffer.from(data.args[4], "hex");
      } else {
        data.args[4] = Buffer.alloc(0);
      }

      let result;
      try {
        // @ts-ignore
        result = await transport.send(...data.args);
      } catch(e) {
        return stream.write({
          id: data.id,
          err: e
        })
      }

      return stream.write({
        id: data.id,
        res: result.toString("hex"),
      })

      break
  }
}

export default api;
