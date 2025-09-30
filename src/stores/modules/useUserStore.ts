import { defineStore } from "pinia";
import { ref } from "vue";
import { removeFromLocalStorage } from "@/utils/LocalStorage";
import { getUserInfo } from "@/api";

export const useUserStore = defineStore(
  "useUserStore",
  () => {
    const fileBaseUrl = import.meta.env.VITE_FILE_BASE_URL;

    const userName = ref("");
    const profie = ref("");
    const token = ref<string | null>("null");
    const accountNumber = ref("");
    const id = ref<null | number>(null);
    const permission = ref("");
    const personalizedSignature = ref('人生是旷野，去追寻风和自由吧')



    const is2FAEnabled = ref(false)

    // actions
    function toggle2FA() {
      is2FAEnabled.value = !is2FAEnabled.value
    }

    // deflault.png
    const setUserInfo = (userInfo: any) => {
      userName.value = userInfo.userName;
      profie.value = fileBaseUrl + userInfo.profilePhoto;
      permission.value = userInfo.permission;
      if (userInfo.token) {
        token.value = userInfo.token;
      }
      accountNumber.value = userInfo.accountNumber;
      id.value = userInfo.id;

    };

    const getUserInfoData = async () => {
      const res = await getUserInfo<any>({ id: id.value });
      if (res.code !== 200) return;
      setUserInfo(res.data);
    };

    const cleanUserInfo = () => {
      userName.value = "";
      profie.value = "";
      token.value = null;
      accountNumber.value = "";
      id.value = null;
      id.value = null;
      permission.value = "";
      removeFromLocalStorage("userInfo");
    };




    return {
      userName,
      profie,
      token,
      accountNumber,
      id,
      personalizedSignature,

      getUserInfoData,
      setUserInfo,
      cleanUserInfo,

    };
  },
  { persist: true }
);
