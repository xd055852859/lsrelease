<script setup lang="ts">
import Avatar from "@/components/avatar.vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { login } from "@/services/util/common";
import cDrawer from "@/components/common/cDrawer.vue";
import router from "@/router";
import api from "@/services/api";
import { Region, ResultProps } from "@/interface/Common";
import "@/styles/animate/hover.scss";
const { domain } = storeToRefs(appStore.domainStore);
const { token, user } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const { newsTag, circleTag } = storeToRefs(appStore.tagStore);
const { setToken, setUserInfo } = appStore.authStore;
const { setTabType } = appStore.commonStore;
const navRef = ref<any>(null);
const scrollState = ref<boolean>(false);
const headerVisible = ref<boolean>(false);
const cityArray = ref<Region[]>([]);
const districtArray = ref<Region[]>([]);
const townArray = ref<Region[]>([]);
const villageArray = ref<Region[]>([]);
const cityIndex = ref<number | null>(0);
const districtIndex = ref<number | null>(0);
const townIndex = ref<number | null>(0);
const villageIndex = ref<number | null>(null);
const menuVisible = ref<boolean>(false);
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
  <div class="p-header">
    <div class="p-header-container">
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
        <q-btn
          icon="menu"
          color="grey-9"
          flat
          round
          dense
          @click="menuVisible = true"
        />
        <!-- <el-button
          type="success"
          @click="logout"
          v-if="$route.name === 'computerUserCenter' && user"
          >退出登录</el-button
        > -->
      </div>
    </div>
    <c-drawer
      :visible="menuVisible"
      @close="menuVisible = false"
      :drawerStyle="{
        width: '200px',
        maxHeight: '100vh',
      }"
      opacityMask
    >
      <template #content>
        <q-list padding>
          <q-item :to="{ name: `${deviceType}home` }" exact>
            <q-item-section> 首页 </q-item-section>
          </q-item>
          <q-item :to="{ name: `${deviceType}invest` }" exact>
            <q-item-section> 招商信息 </q-item-section>
          </q-item>
          <q-item :to="{ name: `${deviceType}product` }" exact>
            <q-item-section> 产品推介 </q-item-section>
          </q-item>
          <q-item :to="{ name: `${deviceType}news` }" exact>
            <q-item-section> 两山新闻 </q-item-section>
          </q-item>
          <q-item :to="{ name: `${deviceType}policy` }" exact>
            <q-item-section> 两山政策 </q-item-section>
          </q-item>
        </q-list>
      </template>
    </c-drawer>
  </div>
</template>
<style scoped lang="scss">
.p-header {
  width: 100vw;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.4);
  @include flex(center, center, null);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 5;

  .p-header-container {
    width: 100vw;
    height: 100%;
    @include p-num(0px, 10px);
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
        margin: 0px 20px 0px 15px;
      }
    }
  }
}
.header-area {
  max-height: 70vh;
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
      width: 25%;
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
<style lang="scss"></style>
