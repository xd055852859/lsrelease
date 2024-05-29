import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

// 使用setup模式定义
export const authStore = defineStore("authStore", () => {
  const token = ref<string>("");
  const uploadToken = ref<string>("");
  const user = ref<User | null>(null);

  const setToken = (newToken: string) => {
    token.value = newToken;
    // if (!localStorage.getItem("token") && newToken) {
    //   api.request.post("user/client");
    // }
    localStorage.setItem("token", newToken);
  };
  const setUserInfo = (newUserInfo: User | null) => {
    user.value = newUserInfo;
  };
  const getUserInfo = async () => {
    const userInfoRes = (await api.request.get("user")) as ResultProps;
    if (userInfoRes.msg === "OK") {
      user.value = {
        _key: userInfoRes.data._key,
        userAvatar: userInfoRes.data.userAvatar,
        userName: userInfoRes.data.userName,
        mobile: userInfoRes.data.mobile,
        intentionNum: userInfoRes.data.intentionNum,
        lOfferNum: userInfoRes.data.lOfferNum,
        rOfferNum: userInfoRes.data.rOfferNum,
        resourceNum: userInfoRes.data.resourceNum,
        certified: userInfoRes.data.certified,
        company: userInfoRes.data.company,
        address: userInfoRes.data.address,
        email: userInfoRes.data.email,
      };
    }
  };

  const getUploadToken = async () => {
    const tokenRes: any = (await api.request.get(
      "upTokenQiniu/getQiNiuUpToken",
      {
        token: token.value,
        type: 2,
        bucketType: 9,
      },
      true
    )) as ResultProps;
    if (tokenRes.msg === "OK") {
      uploadToken.value = tokenRes.result;
    }
  };
  return {
    token,
    user,
    setToken,
    setUserInfo,
    getUserInfo,
    uploadToken,
    getUploadToken,
  };
});
