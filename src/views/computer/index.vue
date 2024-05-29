<script setup lang="ts">
import { is_mobile } from "@/services/util/util";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import CHeader from "@/components/computer/cHeader.vue";
const { setDeviceType } = appStore.commonStore;
const { deviceType } = storeToRefs(appStore.commonStore);
const router = useRouter();
const includeList: any = [];
watch(
  () => router.currentRoute.value,
  (val) => {
    if (val.meta.keepAlive && includeList.indexOf(val.name) === -1) {
      includeList.push(val.name);
    }
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <div class="computer">
    <c-Header />
    <!-- <keep-alive
      ><router-view v-if="$route.meta.keepAlive"></router-view
    ></keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <router-view #default="{ Component }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="includeList" max="2">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<style scoped lang="scss">
.computer {
  width: 100%;
  height: 100vh;
  @include scroll();
}
</style>
<style></style>
