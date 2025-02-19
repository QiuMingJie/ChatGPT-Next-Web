import request from "@/app/utils/request";

export async function chatNewTCMchat(data: any) {
  return request(
    `http://120.25.222.199:8095/ios/class/diagnosis/chat/newTCMchat`,
    {
      method: "POST",
      data,
    },
  );
}

export async function chatSearchTCMchat(data: any) {
  return request(
    `http://120.25.222.199:8095/ios/class/diagnosis/chat/searchTCMchat
`,
    {
      method: "POST",
      data,
    },
  );
}
export async function userLogin(data: any): Promise<any> {
  return request(`http://120.25.222.199:8095/ios/class/diagnosis/user/lgin`, {
    method: "POST",
    data,
  });
}
