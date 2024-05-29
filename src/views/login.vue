<script setup lang="ts">
import { is_mobile } from "@/services/util/util";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const router = useRouter();
const { deviceType } = storeToRefs(appStore.commonStore);
const { domain, codeName } = storeToRefs(appStore.domainStore);
onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push(`/${codeName.value}/${deviceType.value}/`);
  }
});

const login = () => {
  let redirect = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}${window.location.pathname}#/${deviceType.value}/`
  );
  localStorage.clear();
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?app=101&apphigh=55&logo=${domain.value?.logo}&redirect=${redirect}`;
  if (is_mobile()) {
    window.open(href);
    router.push(`/phone/resource`);
  } else {
    window.open(href, "_self");
  }
};
</script>
<template>
  <div class="welcome">
    <div class="logo-img">
      <div class="img">
        <img :src="domain?.logo" alt="" />
      </div>
      <div class="logo-title">{{ domain?.name }}</div>
    </div>
    <div class="logo-button">
      <el-button type="success" @click="login">登录</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.welcome {
  width: 100vw;
  height: 100vh;
  .logo-img {
    width: 100vw;
    height: 80vh;
    align-content: center;
    @include flex(center, center, wrap);
    > div {
      width: 100%;
      @include flex(center, center, wrap);
    }
    .img {
      margin-top: 20px;
      img {
        width: 200px;
      }
    }
    .logo-title {
      width: 100%;
      height: 42px;
      font-size: 22px;
      font-weight: 500;
    }
  }
  .logo-button {
    font-size: 16px;
    @include flex(center, center, null);
  }
}
</style>
<style lang="scss">
.logo-button {
  .el-button {
    width: 100px;
    height: 45px;
    font-size: 18px;
  }
}
</style>
