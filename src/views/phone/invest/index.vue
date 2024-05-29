<script setup lang="ts" name="computerinvest">
import appStore from "@/store";
import ResourceItem from "@/components/resourceItem.vue";
import {commonscroll} from "@/services/util/common";
import {storeToRefs} from "pinia";
import api from "@/services/api";
import {ResultProps, Tag} from "@/interface/Common";
import {Resource} from "@/interface/Resource";
import SelectRegion from "@/components/selectRegion.vue";

interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}

const route = useRoute();
const {domain} = storeToRefs(appStore.domainStore);
const {user} = storeToRefs(appStore.authStore);
const investList = ref<any[]>([]);
const tagList = ref<Tag[]>([]);
const tagKey = ref<string>("");
const starIndex = ref<number | null>(null);
const townArray = ref<Region[]>([]);
const resourceName = ref<string>("");
const inputName = ref<string>("");
const townCode = ref<string>("");
const area = ref<string>("");
const keyProject = ref<number | null>(null);
const investmentObjective = ref<string>("");
const page = ref<number>(1);
const total = ref<number>(0);
const boxRef = ref<any>(null);
const height = ref<number>(0);
const workArray = ["资金引入", "运营合作", "技术合作"];
const areaArray = ["0-500 ㎡", "500-1000 ㎡", "1000-3000 ㎡", "3000 ㎡以上"];

const getInvest = async () => {
  let obj: any = {
    resourceName: resourceName.value,
    limit: 30,
    page: page.value,
  };
  if (tagKey.value) {
    obj.tagKey = tagKey.value;
  }
  if (townCode.value) {
    obj.regionCode = townCode.value;
  }
  if (keyProject.value) {
    obj.keyProject = keyProject.value === 1;
  }
  if (investmentObjective.value !== "全部") {
    obj.investmentObjective = investmentObjective.value;
  }
  if (area.value !== "全部") {
    switch (area.value) {
      case "0-500 ㎡":
        obj.minArea = 0;
        obj.maxArea = 500;
        break;
      case "500-1000 ㎡":
        obj.minArea = 500;
        obj.maxArea = 1000;
        break;
      case "1000-3000 ㎡":
        obj.minArea = 1000;
        obj.maxArea = 3000;
        break;
      case "3000 ㎡以上":
        obj.minArea = 3000;
        break;
    }
  }
  const resourceRes = (await api.request.get("ecoResource", {
    ...obj,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    if (page.value === 1) {
      investList.value = [];
    }
    investList.value = [...investList.value, ...resourceRes.data];
    total.value = resourceRes.total as number;
  }
};
const getRegion = async (code: string) => {
  const regionRes = (await api.request.get("regionCode/subByCode", {
    code: code,
  })) as ResultProps;
  if (regionRes.msg === "OK") {
    townArray.value = [...regionRes.data];
    height.value = boxRef.value.offsetHeight + 15;
  }
};
const getTag = async () => {
  const tagRes = (await api.request.get("resourceTag/list", {
    fatherId: "",
  })) as ResultProps;
  if (tagRes.msg === "OK") {
    tagList.value = [...tagRes.data];
  }
};

watch(
    domain,
    (newVal, oldVal) => {
      if (newVal?.regionCode && !oldVal) {
        getRegion(newVal?.regionCode);
        getTag();
      }
    },
    {immediate: true}
);
watch([townCode, area, tagKey, keyProject, investmentObjective], () => {
  page.value = 1;
});
watch(inputName, (newVal) => {
  if (!newVal) {
    resourceName.value = "";
    page.value = 1;
  }
});
watchEffect(() => {
  if (domain.value) {
    getInvest();
  }
});
</script>
<template>
  <div class="invest">
    <div class="invest-box" ref="boxRef">
      <div class="invest-nav">
        <q-select
            outlined
            dense
            v-model="investmentObjective"
            label="合作类型"
            class="q-mr-sm q-mb-sm"
            style="width: 42%"
            :options="workArray"
            clearable
        />
        <q-select
            outlined
            dense
            v-model="tagKey"
            label="资源类型"
            class="q-mr-sm q-mb-sm"
            style="width: 42%"
            :options="[...tagList]"
            :option-value="(opt) => opt._key"
            :option-label="(opt) => opt.name"
            emit-value
            map-options
            clearable
        />
        <q-select
            outlined
            dense
            v-model="area"
            label="资源面积"
            class="q-mr-sm q-mb-sm"
            style="width: 42%"
            :options="areaArray"
            emit-value
            map-options
            clearable
        />
        <q-select
            outlined
            dense
            v-model="keyProject"
            label="重点项目"
            class="q-mr-sm q-mb-sm"
            style="width: 42%"
            :options="[
            { label: '重点', value: 1 },
            { label: '非重点', value: 2 },
          ]"
            emit-value
            map-options
            clearable
        />
      </div>
      <div class="invest-region">
        <SelectRegion
            :regionCode="domain.regionCode"
            @setCode="
            (obj, code) => {
              townCode = code;
            }"
            :inputStyle=" {width: '42%' } "
            v-if="domain"
            clearState
            @clearCode="townCode = domain.regionCode"
        />
      </div>

      <div class="invest-search dp-center-center">
        <q-input
            outlined
            v-model="inputName"
            placeholder="请输入项目关键词"
            dense
            style="width: 42%"
            clearable
            class="q-mr-sm"
        />
        <q-btn
            color="primary"
            label="搜索"
            style="width: 70px"
            @click="
            resourceName = inputName;
            page = 1;
          "
        />
      </div>
    </div>
    <div
        class="invest-container common-box"
        :style="{ height: `calc(100% - ${height}px)` }"
        @scroll="
        commonscroll($event, investList, total, () => {
          page++;
        })
      "
        v-if="boxRef"
    >
      <div
          class="common-info"
          style="width: 100%; margin-right: 0px"
          v-for="(item, index) in investList"
          :key="'invest' + index"
          @click="
          $router.push({
            name: 'phoneinvestInfo',
            params: { investKey: item._key },
          })
        "
      >
        <resource-Item :item="item" :tabType="'invest'" v-if="item"/>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.invest {
  width: 100vw;
  height: 100%;
  padding-top: 60px;
  box-sizing: border-box;
  background: #f5f5f5;
  align-content: flex-start;
  @include flex(center, null, wrap);

  .invest-box {
    width: 95vw;
    max-width: 1200px;
    flex-shrink: 0;
    margin-bottom: 15px;
    // max-width: 1200px;
    .invest-nav {
      width: 100%;
      @include flex(flex-start, center, wrap);
    }

    .invest-region {
      width: 100%;
      @include flex(flex-start, center, wrap);
    }

    .invest-search {
      width: 100%;
      height: 60px;
      @include flex(flex-start, center, wrap);
    }
  }

  .invest-container {
    width: 95vw;
    max-width: 1200px;
    align-content: flex-start;
    @include scroll();
  }
}
</style>
<style></style>
