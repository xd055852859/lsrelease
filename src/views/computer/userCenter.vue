<script setup lang="ts" name="computeruserCenter">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import ResourceItem from "@/components/resourceItem.vue";
import { setMessage } from "@/services/util/common";
import { base64ToFile, fileToBase64, uploadFile } from "@/services/util/file";
import cDialog from "@/components/common/cDialog.vue";
import router from "@/router";
import request from "@/services/api";
import { authStore } from "@/store/auth";

const route = useRoute();
const { deviceType } = storeToRefs(appStore.commonStore);
const { user } = storeToRefs(appStore.authStore);
const { setUserInfo, setToken } = appStore.authStore;
const userResouceList = ref<any>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const chooseType = ref<string>("user");
const userName = ref<string>("");
const userAvatar = ref<string>("");
const cropperVisible = ref<boolean>(false);
const urlBase64 = ref<any>(null);
const cropperRef = ref<any>(null);

const getList = async () => {
  let url = "";
  let obj: any = {};
  switch (chooseType.value) {
    case "resouce":
      url = "ecoResource/user";
      break;
    case "invest":
      url = "ecoResource/user";
      obj = {
        investmentProject: true,
      };
      break;
    case "product":
      url = "product/user";
      break;
    case "intention":
      url = "product/intention";
      break;
  }
  let dataRes = (await api.request.get(url, {
    ...obj,
    page: page.value,
    limit: 50,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    if (page.value === 1) {
      userResouceList.value = [];
    }
    userResouceList.value = [...userResouceList.value, ...dataRes.data];
    total.value = dataRes.total as number;
  }
};
const updateUser = async () => {
  if (!userName.value) {
    setMessage("error", "请输入用户名");
    return;
  }
  let userRes = (await api.request.patch("user/config", {
    userName: userName.value,
    userAvatar: userAvatar.value,
  })) as ResultProps;
  if (userRes.msg === "OK") {
    //@ts-ignore
    let newUser: User = {
      ...user.value,
      userName: userName.value,
      userAvatar: userAvatar.value,
    };
    setMessage("success", "编辑用户成功");
    setUserInfo(newUser);
  }
};
const uploadImage = async (file, type) => {
  if (file) {
    console.log(fileToBase64);
    urlBase64.value = await fileToBase64(file);
    cropperVisible.value = true;
  }
};
const saveImg = () => {
  let mimeType = ["image/*"];
  console.log(cropperRef.value);
  cropperRef.value.getCropData((data) => {
    // do something
    console.log(data);
    let file = base64ToFile(data);
    uploadFile(file, mimeType, async (url) => {
      userAvatar.value = url;
      cropperVisible.value = false;
    });
  });
};
const logout = () => {
  setMessage("success", "退出登录成功");
  request.setToken("");
  localStorage.removeItem("token");
  router.replace({ name: deviceType.value });
  authStore().$reset();
};
watch(
  user,
  (newUser) => {
    if (newUser) {
      userAvatar.value = newUser?.userAvatar ? newUser.userAvatar : "";
      userName.value = newUser?.userName ? newUser.userName : "";
    }
  },
  { immediate: true }
);
watch(chooseType, (newType) => {
  if (newType !== "user") {
    if (page.value === 1) {
      getList();
    } else {
      page.value = 1;
    }
  }
});
watch(page, () => {
  getList();
});
watch(
  route,
  () => {
    if (chooseType.value !== "user") {
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <div class="userCenter">
    <div class="userCenter-box">
      <div class="userCenter-left">
        <div
          class="userCenter-left-item"
          @click="chooseType = 'user'"
          :class="{ 'choose-nav': chooseType === 'user' }"
        >
          用户信息
        </div>
        <div
          class="userCenter-left-item btn"
          @click="chooseType = 'resouce'"
          :class="{ 'choose-nav': chooseType === 'resouce' }"
        >
          发布资源
          <!-- /ecoResource/user -->
        </div>
        <div
          class="userCenter-left-item btn"
          @click="chooseType = 'invest'"
          :class="{ 'choose-nav': chooseType === 'invest' }"
        >
          <!-- investmentProject -->
          转化招商
        </div>
        <div
          class="userCenter-left-item btn"
          @click="chooseType = 'product'"
          :class="{ 'choose-nav': chooseType === 'product' }"
        >
          发布产品
          <!-- 
​/product​/user
我发布的产品列表(前台) -->
        </div>
        <div
          class="userCenter-left-item btn"
          @click="chooseType = 'intention'"
          :class="{ 'choose-nav': chooseType === 'intention' }"
        >
          <!-- /product/intention -->
          意向资源
        </div>
        <div class="userCenter-button">
          <q-btn
            icon="logout"
            color="grey-6"
            flat
            round
            dense
            @click="logout()"
            size="18px"
          >
            <q-tooltip>退出登录</q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="userCenter-right common-box">
        <template v-if="chooseType === 'user'">
          <div className="form-container">
            <div className="form-button">
              <q-btn label="保存" color="primary" @click="updateUser" />
            </div>
            <div className="form-logo">
              <div className="upload-button upload-img-button logo-box">
                <img
                  :src="userAvatar"
                  alt=""
                  style="width: 100%; height: 100%"
                  class="upload-cover"
                  v-if="userAvatar"
                />
                <q-icon name="add" style="color: #ebebeb" size="80px" v-else />
                <input
                  type="file"
                  accept="image/*"
                  @change="
                    //@ts-ignore
                    uploadImage($event.target.files[0], 'avatar')
                  "
                  class="upload-img"
                />
              </div>
            </div>
            <div className="form-name">
              <q-input
                outlined
                v-model="userName"
                label="用户名"
                style="width: 350px"
                :rules="[(val) => !!val || '用户名必填']"
              />
            </div></div
        ></template>
        <template v-else>
          <div
            class="common-info"
            v-for="(item, index) in userResouceList"
            :key="'product' + index"
            @click="
              chooseType === 'resouce' || chooseType === 'invest'
                ? $router.push({
                    name: 'computerinvestInfo',
                    params: { investKey: item._key },
                  })
                : $router.push({
                    name: 'computerproductInfo',
                    params: { productKey: item._key },
                  })
            "
          >
            <resource-Item
              :item="item"
              :type="
                chooseType === 'resouce' || chooseType === 'product'
                  ? 'mine'
                  : ''
              "
              :tabType="
                chooseType === 'resouce' || chooseType === 'invest'
                  ? 'invest'
                  : 'product'
              "
              v-if="item"
            />
          </div>
        </template>
      </div>
    </div>

    <c-dialog
      :visible="cropperVisible"
      @close="cropperVisible = false"
      title="裁剪图片"
    >
      <template #content>
        <div style="width: 500px; height: 400px">
          <VueCropper
            ref="cropperRef"
            :img="urlBase64"
            :autoCrop="true"
            :centerBox="true"
          />
        </div>
      </template>
      <template #footer>
        <q-btn
          flat
          label="取消"
          color="grey-5"
          @click="cropperVisible = false"
          :dense="true" />
        <q-btn label="确认" color="primary" @click="saveImg"
      /></template>
    </c-dialog>
  </div>
</template>
<style scoped lang="scss">
.userCenter {
  width: 100vw;
  height: 100vh;
  padding-top: 80px;
  padding-bottom: 20px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include flex(center, null, wrap);
  .userCenter-box {
    width: 95vw;
    max-width: 1500px;
    height: 100%;
    @include flex(space-between, null, null);
    .userCenter-left {
      width: 120px;
      height: 100%;
      margin-right: 15px;
      position: relative;
      z-index: 1;
      .userCenter-left-item {
        width: 100%;
        height: 40px;
        font-size: 14px;
        @include flex(center, center, null);
        cursor: pointer;
        flex-shrink: 0;
        margin-bottom: 10px;
        // color: #333;
      }
      .choose-nav {
        color: #fff;
        background-color: $commonColor;
        // color: $commonColor;
      }
      .userCenter-button {
        width: 100%;
        height: 40px;
        position: absolute;
        z-index: 2;
        left: 0px;
        bottom: 10px;
        @include flex(center, center, null);
      }
    }
    .userCenter-right {
      flex: 1;
      height: 100%;
      align-content: flex-start;
      @include scroll();
    }
  }
}
</style>
<style lang="scss">
.form-container {
  width: 100%;
  height: 100%;
  .form-button {
    margin-bottom: 10px;
    @include flex(flex-end, center, null);
  }

  .form-logo {
    width: 100%;
    height: 350px;
    margin-bottom: 50px;
    @include flex(center, center, null);
    .logo-box {
      width: 350px;
      height: 350px;
      border-radius: 12px;
      overflow: hidden;
    }
  }
  .form-name {
    width: 100%;
    @include flex(center, center, null);
  }
}
</style>
