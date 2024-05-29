<script setup lang="ts">
import Avatar from "@/components/avatar.vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { login } from "@/services/util/common";

import router from "@/router";
import api from "@/services/api";
import { Region, ResultProps } from "@/interface/Common";
import "@/styles/animate/hover.scss";
const { domain } = storeToRefs(appStore.domainStore);
const {  user } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const navRef = ref<any>(null);
const headerVisible = ref<boolean>(false);
const cityArray = ref<Region[]>([]);
const districtArray = ref<Region[]>([]);
const townArray = ref<Region[]>([]);
const villageArray = ref<Region[]>([]);
const cityIndex = ref<number | null>(0);
const districtIndex = ref<number | null>(0);
const townIndex = ref<number | null>(0);
const villageIndex = ref<number | null>(null);

const getRegion = async (level: number, code: string) => {
  const regionRes = (await api.request.get("regionCode/subByCode", {
    code: code,
  })) as ResultProps;
  if (regionRes.msg === "OK") {
    switch (level) {
      case 1:
        cityArray.value = [...regionRes.data];
        cityIndex.value = 0;
        districtIndex.value = 0;
        townIndex.value = 0;
        villageIndex.value = null;
        getRegion(2, cityArray.value[0].areaCode);
        break;
      case 2:
        districtArray.value = [...regionRes.data];
        districtIndex.value = 0;
        townIndex.value = 0;
        villageIndex.value = null;
        getRegion(3, districtArray.value[0].areaCode);
        break;
      case 3:
        townArray.value = [...regionRes.data];
        townIndex.value = 0;
        villageIndex.value = null;
        getRegion(4, townArray.value[0].areaCode);
        break;
      case 4:
        villageIndex.value = null;
        villageArray.value = [...regionRes.data];
        break;
    }
  }
};

const chooseArea = (level: number, index: number, item: Region) => {
  if (item.codeName) {
    window.open(
      `${window.location.protocol}//${window.location.host}/${item.codeName}/${deviceType.value}/`
    );
  }
  switch (level) {
    case 3:
      cityIndex.value = index;
      getRegion(2, cityArray.value[index].areaCode);
      break;
    case 4:
      districtIndex.value = index;
      getRegion(3, districtArray.value[index].areaCode);
      break;
    case 5:
      townIndex.value = index;
      getRegion(4, townArray.value[index].areaCode);
      break;
    case 6:
      villageIndex.value = index;
      break;
  }
};

watch(headerVisible, (newVisible) => {
  if (newVisible && domain.value) {
    getRegion(domain.value.level, domain.value.regionCode);
  }
});
</script>
<template>
  <div class="c-header">
    <div class="c-header-container">
      <div class="left" @click="headerVisible = true">
        <img :src="domain.logo" alt="" v-if="domain" /> {{ domain?.name }}
        <q-icon
          name="expand_more"
          color="#fff"
          style="margin-left: 8px"
          size="25px"
        />

        <q-menu
          class="q-pa-md"
          style="width: calc(100vw - 40px)"
          transition-show="jump-down"
          transition-hide="jump-up"
        >
          <div class="header-area" v-if="domain?.level">
            <div v-if="domain.level < 2" class="area-name">市级</div>
            <div class="area-box">
              <div
                v-for="(item, index) in cityArray"
                :key="'city' + index"
                @click="chooseArea(3, index, item)"
                :class="{
                  'choose-item': cityIndex === index,
                  unName: !item.codeName,
                }"
              >
                {{ item.name }}
              </div>
            </div>
            <div v-if="domain.level < 3" class="area-name">区县</div>
            <div class="area-box">
              <div
                v-for="(item, index) in districtArray"
                :key="'district' + index"
                @click="chooseArea(4, index, item)"
                :class="{
                  'choose-item': districtIndex === index,
                  unName: !item.codeName,
                }"
              >
                {{ item.name }}
              </div>
            </div>
            <div v-if="domain.level < 4" class="area-name">乡镇</div>
            <div class="area-box">
              <div
                v-for="(item, index) in townArray"
                :key="'town' + index"
                @click="chooseArea(5, index, item)"
                :class="{
                  'choose-item': townIndex === index,
                  unName: !item.codeName,
                }"
              >
                {{ item.name }}
              </div>
            </div>
            <div v-if="domain.level < 5" class="area-name">村级</div>
            <div class="area-box">
              <div
                v-for="(item, index) in villageArray"
                :key="'village' + index"
                @click="chooseArea(6, index, item)"
                :class="{
                  'choose-item': villageIndex === index,
                  unName: !item.codeName,
                }"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </q-menu>
      </div>

      <div class="right">
        <div class="header-nav-box" ref="navRef">
          <div class="header-nav">
            <div
              @click="$router.push({ name: `${deviceType}home` })"
              class="btn"
              :class="{ 'choose-nav': $route.name === `${deviceType}home` }"
            >
              首页
            </div>
            <div
              @click="$router.push({ name: `${deviceType}invest` })"
              class="btn"
              :class="{ 'choose-nav': $route.name === `${deviceType}invest` }"
            >
              招商信息
            </div>
            <div
              @click="$router.push({ name: `${deviceType}product` })"
              class="btn"
              :class="{ 'choose-nav': $route.name === `${deviceType}product` }"
            >
              产品推介
            </div>
            <div
              @click="$router.push({ name: `${deviceType}news` })"
              class="btn"
              :class="{ 'choose-nav': $route.name === `${deviceType}news` }"
            >
              两山新闻
            </div>
            <div
              @click="$router.push({ name: `${deviceType}policy` })"
              class="btn"
              :class="{ 'choose-nav': $route.name === `${deviceType}policy` }"
            >
              两山政策
            </div>
          </div>
        </div>
        <div
          @click="$router.push({ name: `${deviceType}userCenter` })"
          v-if="user"
        >
          <avatar
            :name="user.userName"
            :avatar="user.userAvatar"
            type="person"
            :index="0"
            :size="40"
            :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
          />
        </div>

        <q-btn color="primary" @click="login()" v-if="!user">登录</q-btn>
        <!-- <el-button
          type="success"
          @click="logout"
          v-if="$route.name === 'computerUserCenter' && user"
          >退出登录</el-button
        > -->
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.c-header {
  width: 100vw;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.4);

  @include flex(center, center, null);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;

  .c-header-container {
    width: 100vw;
    height: 100%;
    @include p-num(0, 30px);
    @include flex(space-between, center, null);
    .left {
      font-size: 16px;
      color: #333;
      cursor: pointer;
      @include flex(null, center, null);
      height: 100%;
      > img {
        height: 60%;
        margin-right: 10px;
      }
    }
    .right {
      height: 100%;
      font-size: 20px;
      @include flex(center, center, null);
      .header-nav-leftIcon,
      .header-nav-rightIcon {
        height: 100%;
        cursor: pointer;
        @include flex(center, center, null);
      }
      .header-nav-leftIcon {
        margin-right: 20px;
      }
      .header-nav-rightIcon {
        margin: 0 20px 0 15px;
      }
    }
  }
}
.header-area {
  max-height: 50vh;
  @include scroll();
  .area-name {
    height: 50px;
    font-weight: 500;
    font-size: 16px;
    @include flex(null, center, null);
  }
  .area-box {
    @include flex(null, center, wrap);
    > div {
      width: 12.5%;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 10px;
      font-size: 14px;
      // @include flex(center, center, wrap);
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }

    .unName {
      color: #c5c5c5;
    }
    .choose-item {
      background: #d0efd8;
      color: #46a03c;
    }
  }
}
.header-tab {
  width: 100%;
  flex-wrap: wrap;
  .tab-item {
    width: 25%;
    height: 50px;
    margin-bottom: 18px;
    color: #666;
    font-size: 14px;
    > div {
      width: 100%;
      @include flex(center, center, null);
      &:nth-child(1) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
<style lang="scss">
.header-nav-box {
  height: 100%;
  margin-right: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  @include flex(null, center, null);
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .header-nav {
    height: 100%;
    @include flex(null, center, null);
    color: #333;
    > div {
      // width: 120px;
      // height: 100%;
      font-size: 14px;
      @include flex(center, center, null);
      cursor: pointer;
      flex-shrink: 0;
      margin-right: 10px;
    }
    .choose-nav {
      color: #fff;
      background-color: $commonColor;
      // color: $commonColor;
    }
  }
}
</style>
