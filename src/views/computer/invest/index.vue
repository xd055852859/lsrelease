<script setup lang="ts"  name="computerinvest">
import appStore from "@/store";
import ResourceItem from "@/components/resourceItem.vue";
import { commonscroll } from "@/services/util/common";
import { storeToRefs } from "pinia";
import api from "@/services/api";
import { ResultProps, Tag } from "@/interface/Common";
import { Resource } from "@/interface/Resource";

interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
const route = useRoute();
const { domain } = storeToRefs(appStore.domainStore);
const { user } = storeToRefs(appStore.authStore);
const investList = ref<any[]>([]);
const tagList = ref<Tag[]>([]);
const tagKey = ref<string>("");
const starIndex = ref<number | null>(null);
const townArray = ref<Region[]>([]);
const resourceName = ref<string>("");
const inputName = ref<string>("");
const townCode = ref<string>("");
const workIndex = ref<number>(0);
const areaIndex = ref<number>(-1);
const keyProject = ref<boolean | null>(null);
const page = ref<number>(1);
const total = ref<number>(0);
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
  if (keyProject.value !== null) {
    obj.keyProject = keyProject.value;
  }
  if (workIndex.value) {
    obj.investmentObjective = workArray[workIndex.value - 1];
  }
  switch (areaIndex.value) {
    case 0:
      obj.minArea = 0;
      obj.maxArea = 500;
      break;
    case 1:
      obj.minArea = 500;
      obj.maxArea = 1000;
      break;
    case 2:
      obj.minArea = 1000;
      obj.maxArea = 3000;
      break;
    case 3:
      obj.minArea = 3000;
      break;
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
  { immediate: true }
);
watch([townCode, areaIndex, tagKey, keyProject, workIndex], () => {
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
    <div class="invest-box">
      <div class="invest-nav">
        <div class="nav-item">
          <div class="left">合作类型</div>
          <div class="right">
            <div
              @click="workIndex = 0"
              :class="{ 'choose-item': workIndex === 0 }"
            >
              全部
            </div>
            <div
              v-for="(item, index) in workArray"
              :key="'work' + index"
              @click="workIndex = index + 1"
              :class="{ 'choose-item': workIndex === index + 1 }"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="nav-item">
          <div class="left">资源类型</div>
          <div class="right">
            <div @click="tagKey = ''" :class="{ 'choose-item': tagKey === '' }">
              全部
            </div>
            <div
              v-for="(item, index) in tagList"
              :key="'town' + index"
              @click="tagKey = item._key"
              :class="{ 'choose-item': tagKey === item._key }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="nav-item" v-if="domain?.level && domain.level < 5">
          <div class="left">行政区</div>
          <div class="right">
            <div
              @click="townCode = ''"
              :class="{ 'choose-item': townCode === '' }"
            >
              全部
            </div>
            <div
              v-for="(item, index) in townArray"
              :key="'town' + index"
              @click="townCode = item.areaCode"
              :class="{ 'choose-item': townCode === item.areaCode }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="nav-item">
          <div class="left">资源面积</div>
          <div class="right">
            <div
              @click="areaIndex = -1"
              :class="{ 'choose-item': areaIndex === -1 }"
            >
              全部
            </div>
            <div
              v-for="(item, index) in areaArray"
              :key="'area' + index"
              @click="areaIndex = index"
              :class="{ 'choose-item': areaIndex === index }"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="nav-item">
          <div class="left">重点项目</div>
          <div class="right">
            <div
              @click="keyProject = null"
              :class="{ 'choose-item': keyProject === null }"
            >
              全部
            </div>
            <div
              @click="keyProject = true"
              :class="{ 'choose-item': keyProject === true }"
            >
              重点
            </div>
            <div
              @click="keyProject = false"
              :class="{ 'choose-item': keyProject === false }"
            >
              非重点
            </div>
          </div>
        </div>
      </div>
      <div class="invest-search">
        <div class="dp--center">
          <q-input
            outlined
            v-model="inputName"
            placeholder="请输入项目关键词"
            dense
            style="width: 200px"
            clearable
            class="q-mr-sm"
          />
          <q-btn
            color="primary"
            label="搜索"
            style="width: 80px"
            @click="
              resourceName = inputName;
              page = 1;
            "
          />
        </div>

        <q-btn
          color="primary"
          label="新增资源"
          @click="$router.push({ name: 'computerinvestForm' })"
          v-if="user"
        />
      </div>
      <div
        class="invest-container common-box"
        @scroll="
          commonscroll($event, investList, total, () => {
            page++;
          })
        "
      >
        <div
          class="common-info"
          v-for="(item, index) in investList"
          :key="'invest' + index"
          @click="
            $router.push({
              name: 'computerinvestInfo',
              params: { investKey: item._key },
            })
          "
        >
          <resource-Item :item="item" :tabType="'invest'" v-if="item" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.invest {
  width: 100vw;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include scroll();
  @include flex(center, null, wrap);
  .invest-box {
    width: 95vw;
    max-width: 1500px;
    // max-width: 1500px;
    .invest-nav {
      width: 100%;
      height: 210px;
      margin-bottom: 20px;
      .nav-item {
        margin-bottom: 10px;
        align-content: flex-start;
        @include flex(null, flex-start, null);
        .left {
          width: 90px;
          height: 30px;
          // padding: 5px 10px;
          font-size: 14px;
          line-height: 30px;
          text-align: left;
          color: $grey-7;
        }
        .right {
          width: calc(100% - 90px);
          color: #777;
          font-size: 14px;
          @include flex(null, center, wrap);
          > div {
            min-width: 90px;
            height: 30px;
            padding: 5px 15px;
            text-align: center;
            cursor: pointer;
            line-height: 20px;
          }
          .choose-item {
            background-color: $commonColor;
            color: #fff;
          }
        }
      }
    }
    .invest-search {
      width: 100%;
      height: 60px;
      margin: 10px 0px;
      @include flex(space-between, center, null);
    }
    .invest-container {
      width: 100%;
      height: calc(100vh - 380px);
      align-content: flex-start;
      @include scroll();
    }
  }
}
</style>
<style></style>
