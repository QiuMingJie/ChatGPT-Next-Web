import request from "@/app/utils/request";
import { CHAT_NEW_TCM } from "../constant";
export async function chatNewTCMchat(data: any) {
  return request(`${CHAT_NEW_TCM}/ios/class/diagnosis/chat/newTCMchat`, {
    method: "POST",
    data,
  });
}

export async function chatSearchTCMchat(data: any) {
  return request(
    `${CHAT_NEW_TCM}/ios/class/diagnosis/chat/searchTCMchat
`,
    {
      method: "POST",
      data,
    },
  );
}
export async function userLogin(data: any): Promise<any> {
  return request(`${CHAT_NEW_TCM}/ios/class/diagnosis/user/lgin`, {
    method: "POST",
    data,
  });
}
