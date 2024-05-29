<script setup lang="ts">
import request from "@/services/api";
import {storeToRefs} from "pinia";
import appStore from "@/store";
import api from "@/services/api";
import {ResultProps} from "@/interface/Common";
import {setMessage} from "@/services/util/common";
import router from "@/router";
import {includes} from "lodash";

const route = useRoute();
const {deviceType} = storeToRefs(appStore.commonStore);
const {codeName} = storeToRefs(appStore.domainStore);
const {setDomain, setCodeName} = appStore.domainStore;
const props = defineProps<{
  codeName?: string;
}>();
const getDomain = async (codeName) => {
  const domainRes = (await api.request.get("client/byCodeName", {
    codeName: codeName,
  })) as ResultProps;
  if (domainRes.msg === "OK") {
    request.setDomainKey(domainRes.data.clientKey);
    request.setRegionCode(domainRes.data.regionCode);
    setDomain(domainRes.data);
    //@ts-ignore
    document.querySelector('link[rel="icon"]').href = domainRes.data.logo;
    document.title = domainRes.data.name;
    setCodeName(codeName);

    if (route.name === "home" || !route.name!.toString()!.includes(deviceType.value)) {
      router.replace({name: deviceType.value});
    }
  }
};
watch(
    () => props.codeName,
    (newName) => {
      if (newName) {
        getDomain(newName);
      }
    },
    {immediate: true}
);
watch(
    deviceType,
    (newType, oldType) => {
      if (newType !== oldType) {
        router.replace({name: route.name!.toString().replace(oldType, newType)});
      }
    }
);

</script>
<template>
  <router-view></router-view>
</template>
<style scoped lang="scss"></style>
<style lang="scss"></style>
