<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { setMessage } from "@/services/util/common";
import appStore from "@/store";
import { useThrottleFn } from "@vueuse/shared";
import { storeToRefs } from "pinia";
const { user, token } = storeToRefs(appStore.authStore);
const { deviceWidth } = storeToRefs(appStore.commonStore);
const props = defineProps<{
  item: any;
  tabType: string;
  type?: string;
}>();
const emits = defineEmits<{
  (e: "deleteItem", key: string): void;
}>();
const dayjs: any = inject("dayjs");
const delVisible = ref<boolean>(false);
const showType = ref<string>("twoLine");
const itemRef = ref<any>(null);
const region = ref<string>("");
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      region.value = newItem.regionArr
        ? `${
            newItem.regionArr.cityCode ? newItem.regionArr.cityCode.name : ""
          }${
            newItem.regionArr.districtCode
              ? newItem.regionArr.districtCode.name
              : ""
          }${
            newItem.regionArr.townCode ? newItem.regionArr.townCode.name : ""
          }${
            newItem.regionArr.villageCode
              ? newItem.regionArr.villageCode.name
              : ""
          }`
        : "";
    }
  },
  { immediate: true },
);
</script>
<template>
  <div
    class="resource-item"
    ref="itemRef"
    :style="
      showType === 'oneLine' ? { height: '170px' } : { minHeight: '180px' }
    "
  >
    <!-- deviceType === 'phone' || type === 'home' -->
    <!-- v-if="
        (item.imageList &&
          item.imageList.length > 0 &&
          deviceType === 'phone') ||
        deviceType === 'computer'
      " -->
    <div class="left">
      <img
        :src="item.imageList[0]"
        alt=""
        v-if="item.imageList && item.imageList.length > 0"
      />
      <div v-else class="left-default">
        <img src="/default.png" alt="" />
      </div>
      <!-- <el-empty description="暂无图片" :image-size="60" v-else /> -->
    </div>
    <div class="right">
      <div class="name">{{ item.name }}</div>
      <template v-if="tabType === 'invest'">
        <div class="resource-item-type">
          <template v-if="item.investmentObjective">
            <template
              v-for="(investItem, investIndex) in item.investmentObjective"
              :key="`invest${investIndex}`"
            >
              <q-chip
                color="primary"
                text-color="white"
                size="10px"
                v-if="investItem"
              >
                {{ investItem }}
              </q-chip>
            </template>
          </template>
        </div>
        <div class="resource-item-title">
          <div>估值</div>
          <div>{{ item.valuation ? item.valuation + " 万元" : "" }}</div>
        </div>
        <div class="resource-item-title">
          <div>总面积</div>
          <div>{{ item.area }} {{ item.areaUnit }}</div>
        </div>
      </template>
      <template v-else>
        <div class="resource-item-type">
          <q-chip color="primary" text-color="white" size="10px">{{
            item.type
          }}</q-chip>
        </div>
        <div class="resource-item-title">
          <div>年产量</div>
          <div>{{ item.production }} {{ item.productionUnit }}</div>
        </div>
      </template>
      <div class="resource-item-title">
        <div>所在乡镇</div>
        <div class="single-to-long">
          {{ region }}
          <q-tooltip :offset="[0, 10]" v-if="region.length > 9">
            {{ region }}</q-tooltip
          >
        </div>
      </div>
    </div>
    <div class="resource-item-button" v-if="type === 'mine'">
      <q-btn
        icon="edit"
        color="grey-5"
        round
        dense
        @click.stop="
          tabType === 'invest'
            ? $router.push({
                name: 'computerinvestForm',
                params: { investKey: item._key },
              })
            : $router.push({
                name: 'computerproductForm',
                params: { productKey: item._key },
              })
        "
      />
    </div>
    <!-- <div class="resource-icon-button"> -->
    <!-- <div
      v-if="item.uploadUser !== user?._key && type === 'mine'"
      class="resource-icon1"
    >
      他人
    </div> -->
    <!-- <div v-if="!item.status && type === 'mine'" class="wrap">
      <div class="resource-icon2">未上架</div>
    </div> -->
    <!-- </div> -->
  </div>
  <!-- <el-dialog v-model="delVisible" title="删除圈子" width="350px">
    <span>是否删除该圈子</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <el-button type="info" @click="delVisible = false" link>取消</el-button>
        <el-button type="success" @click="deleteResource()">确认</el-button>
      </span>
    </template>
  </el-dialog> -->
</template>
<style scoped lang="scss">
.resource-item {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  z-index: 1;

  &:hover {
    box-shadow: 0px 2px 10px 0px rgba(141, 141, 141, 0.5);
  }
  .left {
    width: 100%;
    height: 150px;
    overflow: hidden;
    @include flex(center, center, null);

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .left-default {
      width: 100%;
      height: 100%;
      background: #f9f9f9;
      @include flex(center, center, null);
      img {
        width: 123px;
        height: 80px;
      }
    }
  }
  .right {
    width: 100%;
    min-height: 120px;
    padding: 10px;
    box-sizing: border-box;
    > div {
      width: 100%;
      font-size: 14px;
      color: #777;
      min-height: 26px;
      line-height: 26px;
    }
    .name {
      font-size: 16px;
      color: #333;
      height: 25px;
      line-height: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
      text-align: center;
      // white-space: nowrap;
    }
    .resource-item-type {
      width: 100%;
      height: 30px;
      @include flex(flex-start, center, null);
    }
    .resource-item-title {
      width: 100%;
      // min-height: 20px;
      @include flex(flex-start, center, wrap);
      > div:nth-child(1) {
        width: 60px;
        margin-right: 10px;
      }

      > div:nth-child(2) {
        width: calc(100% - 70px);
      }
    }
  }
  .resource-item-button {
    position: absolute;
    z-index: 2;
    right: 10px;
    top: 10px;
    display: none;
  }
  &:hover {
    .resource-item-button {
      display: block;
    }
  }
  // .resource-icon-button {
  //   position: absolute;
  //   top: 0px;
  //   right: 0px;
  //   z-index: 2;
  //   color: #fff;
  //   @include flex(space-between, center, wrap);
  // .resource-icon {
  //   width: 60px;
  //   height: 35px;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   position: absolute;
  //   top: 0px;
  //   right: 0px;
  //   z-index: 2;
  //   @include flex(center, center, wrap);
  //   border-bottom-left-radius: 10px;
  //   border-bottom-right-radius: 10px;
  // }
  .resource-icon1 {
    display: inline-block;
    position: absolute;
    width: 50px;
    height: 36px;
    line-height: 36px;
    padding-left: 15px;
    color: #fff;
    background: #409eff;
    left: -8px;
    top: 7px;
  }
  .resource-icon1:before,
  .resource-icon1:after {
    content: "";
    position: absolute;
  }
  .resource-icon1:before {
    height: 0;
    width: 0;
    border-bottom: 8px solid black;
    border-left: 8px solid transparent;
    top: -8px;
    left: 0;
  }
  .resource-icon1:after {
    height: 0;
    width: 0;
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 15px solid #409eff;
    right: -15px;
  }
  .wrap {
    width: 100%;
    height: 188px;
    position: absolute;
    top: -8px;
    left: 8px;
    overflow: hidden;
    zoom: 0.7;
  }
  .wrap:before {
    content: "";
    display: block;
    border-radius: 8px 8px 0px 0px;
    width: 40px;
    height: 8px;
    position: absolute;
    right: 100px;
    background: #4d6530;
  }
  .wrap:after {
    content: "";
    display: block;
    border-radius: 0px 8px 8px 0px;
    width: 8px;
    height: 40px;
    position: absolute;
    right: 0px;
    top: 100px;
    background: #4d6530;
  }
  .resource-icon2 {
    color: #fff;
    display: inline-block;
    text-align: center;
    width: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 22px;
    position: absolute;
    top: 30px;
    right: -50px;
    z-index: 2;
    overflow: hidden;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    border: 1px dashed;
    box-shadow:
      0 0 0 3px #57dd43,
      0px 21px 5px -18px rgba(0, 0, 0, 0.6);
    background: #57dd43;
  }
}
</style>
<style></style>
