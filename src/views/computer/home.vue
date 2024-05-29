<script setup lang="ts">
import {storeToRefs} from "pinia";
import appStore from "@/store";
import api from "@/services/api";
import {login} from "@/services/util/common";
import ToTop from "@/components/small/toTop.vue";
import {ResultProps, Chart} from "@/interface/Common";
import {Resource} from "@/interface/Resource";
import RingChart from "@/components/chart/ringChart.vue";
import ResourceItem from "@/components/resourceItem.vue";
import _ from "lodash";
// import cHeader from "@/components/computer/cHeader.vue";

import homePng from "@/assets/img/home.png";

const {domain} = storeToRefs(appStore.domainStore);
const {user} = storeToRefs(appStore.authStore);
const bannerIndex = ref<number>(0);
const caseIndex = ref<string>("case0");
const projectIndex = ref<string>("project0");
const productList = ref<any>([]);
const resouceList = ref<any>([]);
const caseAuto = ref<boolean>(true);
const projectAuto = ref<boolean>(true);
const scrollTop = ref<number>(0);
const homeRef = ref<any>(null);
const conversionList = ref<any>(null);
const tagList = ref<any>(null);
const sourceList = ref<any>(null);
const areaList = ref<any>(null);

const getHomeList = async () => {
  const resourceRes = (await api.request.get("ecoResource/key")) as ResultProps;
  if (resourceRes.msg === "OK") {
    productList.value = _.chunk(resourceRes.data.productList, 3);
    resouceList.value = resourceRes.data.resouceList;
    // homeList.value = { ...resourceRes.data };
  }
};
const getChatList = async () => {
  const chatRes = (await api.request.get("ecoResource/summary")) as ResultProps;
  if (chatRes.msg === "OK") {
    conversionList.value = chatRes.data.conversion;
    tagList.value = chatRes.data.tag;
    sourceList.value = chatRes.data.source;
    areaList.value = chatRes.data.area;
    console.log(conversionList.value);
  }
};
const toTop = () => {
  let scrollTop = homeRef.value!.scrollTop;
  let timer: any = setInterval(() => {
    scrollTop = scrollTop - 60;
    if (scrollTop <= 0) {
      clearInterval(timer);
      timer = null;
    }
    homeRef.value!.scrollTop = scrollTop;
  }, 20);
};
watch(
    domain,
    (newVal, oldVal) => {
      if (newVal?.regionCode && !oldVal) {
        getHomeList();
        getChatList();
      }
    },
    {immediate: true}
);
</script>

<template>
  <div class="home" ref="homeRef" @scroll="scrollTop = homeRef!.scrollTop">
    <div class="cloud"><img src="/cloud.png" alt=""/></div>
    <div class="left-icon"><img src="/leftIcon.png" alt=""/></div>
    <div class="right-icon"><img src="/rightIcon.png" alt=""/></div>
    <div class="top" v-if="domain?.banner">
      <div class="banner">
        <q-carousel v-model="bannerIndex" animated transition-prev="jump-right" transition-next="jump-left" swipeable
                    control-color="white" navigation height="540px" infinite autoplay transition-duration="5000"
                    v-if="domain.banner.length > 1">
          <q-carousel-slide class="q-pa-none" v-for="(item, index) in domain.banner" :key="item" :name="index">
            <div class="banner-item"><img :src="item" alt=""/></div>
          </q-carousel-slide>
        </q-carousel>

        <div class="banner-img" v-else>
          <img :src="domain.banner[0] ? domain?.banner[0] : homePng" alt=""/>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="container-button">
        <div class="button-item-box">
          <div class="button-item" @click="user ? $router.push({ name: 'computerinvestForm' }) : login()">
            <div class="button-item-img"><img src="/icon1.png" alt=""/></div>
            <div class="button-item-title">有资源，想转化</div>
          </div>
          <div class="button-item" @click="user ? $router.push({ name: 'computerproductForm' }) : login()">
            <div class="button-item-img"><img src="/icon2.png" alt=""/></div>
            <div class="button-item-title">有产品，想销售</div>
          </div>
        </div>
        <div class="button-item-box">
          <div class="button-item" @click="$router.push({ name: 'computerproduct' })">
            <div class="button-item-img"><img src="/icon3.png" alt=""/></div>
            <div class="button-item-title">有资金，想投资</div>
          </div>
          <div class="button-item" @click="$router.push({ name: 'computerproduct' })">
            <div class="button-item-img"><img src="/icon4.png" alt=""/></div>
            <div class="button-item-title">有能力，想运营</div>
          </div>
        </div>
        <div class="button-item-box">
          <div class="button-item" @click="$router.push({ name: 'computerproduct' })">
            <div class="button-item-img"><img src="/icon5.png" alt=""/></div>
            <div class="button-item-title">有技术，找项目</div>
          </div>
          <div class="button-item" @click="$router.push({ name: 'computerproduct' })">
            <div class="button-item-img"><img src="/icon6.png" alt=""/></div>
            <div class="button-item-title">有渠道，想产品</div>
          </div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-title">
          <div>资源统计</div>
        </div>
        <div class="dp-center-center">
          <div class="common-box" style="justify-content: space-between; width: 900px">
            <div class="container-chart">
              <ring-chart v-if="conversionList" ringId="firstRing" :chartData="conversionList" chartName="转化情况"/>
            </div>
            <div class="container-chart">
              <ring-chart v-if="tagList" ringId="secondRing" :chartData="tagList" chartName="资源分类"/>
            </div>
            <div class="container-chart">
              <ring-chart v-if="sourceList" ringId="thirdRing" :chartData="sourceList" chartName="来源人群"/>
            </div>
            <div class="container-chart">
              <ring-chart v-if="areaList" ringId="fourthRing" :chartData="areaList" chartName="所属区域"/>
            </div>
          </div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-title">
          <div>重点项目推介</div>
          <div @click="$router.push({ name: 'computerinvest' })" class="icon-point">
            更多
            <q-icon name="keyboard_double_arrow_right" style="margin-left: 5px" size="20px"/>
          </div>
        </div>
        <div class="container-product">
          <q-carousel v-model="caseIndex" animated transition-prev="slide-right" transition-next="slide-left" swipeable
                      control-color="#46a03c" navigation arrows height="510px" class="bg-transparent" infinite
                      :autoplay="caseAuto" @mouseenter="caseAuto = false" @mouseleave="caseAuto = true"
                      transition-duration="3000">
            <!--    v-for="(item, index) in domain.banner"
            :key="item"
            :name="index" -->
            <template v-for="(item, index) in resouceList" :key="`case${index}`">
              <q-carousel-slide class="q-pa-none" :name="`case${index}`" v-if="item.imageList">
                <div class="container-case-img icon-point" @click=" $router.push({name: 'computerinvestInfo',params: { investKey: item._key },})">
                  <img :src="item.imageList[0]" alt=""/>
                </div>
              </q-carousel-slide>
            </template>
          </q-carousel>
        </div>
        ˝
      </div>
      <div class="container-item">
        <div class="container-title">
          <div>重点产品推介</div>
          <div @click="$router.push({ name: 'computerproduct' })" class="icon-point">
            更多
            <q-icon name="keyboard_double_arrow_right" style="margin-left: 5px" size="20px"/>
          </div>
        </div>
        <div class="container-resource">
          <q-carousel v-model="projectIndex" swipeable animated transition-prev="slide-right"
                      transition-next="slide-left" control-color="#46a03c" navigation arrows height="350px"
                      class="bg-transparent"
                      infinite :autoplay="projectAuto" @mouseenter="projectAuto = false"
                      @mouseleave="projectAuto = true"
                      transition-duration="3000">

            <template v-for="(item, index) in productList" :key="`case${index}`">
              <q-carousel-slide class="q-pa-none container-case-box" :name="`project${index}`">
                <div class="common-box dp-space-center">
                  <div v-for="(productItem, productIndex) in item"
                       :key="`productItem${index}`"
                       class="common-info icon-point"
                       :style="productIndex === 2? { marginRight: '0', overflow: 'hidden', width: '30%' } : { overflow: 'hidden', width: '30%' }"
                       @click="$router.push({name: 'computerproductInfo',params: { productKey: productItem._key },})">
                    <resource-item :item="productItem" tabType="product" type="home"/>
                  </div>
                </div>
              </q-carousel-slide>
            </template>
          </q-carousel>
        </div>
      </div>
      <ToTop v-if="scrollTop > 300" @click="toTop()"/>
      <div class="mountain"><img src="/mountain.png" alt=""/></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 1;
  // background-color: #F0F4F3;
  @include flex(center, null, wrap);
  @include scroll();

  .cloud {
    width: 100%;
    height: 566px;
    position: absolute;
    z-index: 3;
    top: 230px;
    left: 0;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .left-icon {
    width: 350px;
    position: absolute;
    z-index: 3;
    top: 600px;
    left: 0;

    img {
      width: 100%;
    }
  }

  .right-icon {
    width: 900px;
    position: absolute;
    z-index: 3;
    top: 1200px;
    right: 0;

    img {
      width: 100%;
    }
  }

  .top {
    width: 100%;
    height: 550px;
    align-content: flex-end;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    margin-bottom: 100px;
    position: relative;
    z-index: 1;
    @include flex(center, center, wrap);

    .banner {
      width: 100%;
      height: 550px;
      position: absolute;
      z-index: 2;

      // @include flex(center, center, null);
      .banner-item,
      .banner-img {
        width: 100vw;
        height: 540px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .q-carousel__control {
        display: none;
      }
    }

    .top-box {
      width: 100%;
      @include flex(center, center, null);
      position: relative;
      z-index: 5;
    }

    .title {
      width: 60vw;
      height: 70px;
      font-size: 30px;
      margin-bottom: 30px;
    }

    .tab {
      width: 60vw;
      height: 40px;
      margin-bottom: 30px;
      color: #fff;
      @include flex(center, center, null);

      > div {
        height: 100%;

        cursor: pointer;
        @include flex(center, center, null);

        &:nth-child(2) {
          margin: 0 30px;
        }
      }

      .choose-nav {
        @include choose-border(3px);
      }
    }

    .input {
      margin-bottom: 30px;
    }

    .button {
      height: 40px;
      margin-bottom: 80px;
    }
  }

  .container {
    width: 95vw;
    // width: 85%;
    // max-width: 1200px
    position: relative;
    z-index: 3;
    @include flex(center, null, wrap);

    .mountain {
      width: 100%;
      height: 494px;
      position: absolute;
      z-index: -1;
      bottom: 0;
      left: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .container-button {
      width: 700px;
      height: 300px;
      margin-bottom: 30px;
      @include flex(space-between, null, wrap);

      .button-item-box {
        width: 220px;
        height: 150px;

        .button-item {
          width: 100%;
          height: 145px;
          background: #ffffff;
          box-shadow: 0 2px 10px 0 rgba(141, 141, 141, 0.5);
          cursor: pointer;
          // color:#f0f4f3;

          // box-shadow: 7px 7px 13px #c7cbca, -7px -7px 13px #ffffff;
          @include p-num(10px);

          .button-item-img {
            width: 100%;
            height: 85px;
            margin-bottom: 10px;
            @include flex(center, center, wrap);

            img {
              width: 60px;
              height: 60px;
            }
          }

          .button-item-title {
            height: 30px;
            text-align: center;
            line-height: 30px;
          }

          &:nth-child(1) {
            margin-bottom: 15px;
          }
        }
      }
    }

    .container-resource {
      @include flex(center, center, null);
    }

    .container-item {
      width: 95vw;
      min-width: 650px;
      margin-bottom: 30px;

      .container-title {
        width: 100%;
        height: 55px;
        margin: 20px 0 30px 0;
        font-size: 22px;
        position: relative;
        z-index: 1;
        @include flex(center, center, null);

        :nth-child(1) {
          font-weight: bold;
        }

        :nth-child(2) {
          height: 55px;
          position: absolute;
          z-index: 2;
          top: 0;
          right: 0;
          font-size: 14px;
          color: #777;
          @include flex(null, center, null);
        }
      }

      .container-chart {
        width: 49%;
        height: 250px;
        margin-bottom: 20px;
        box-shadow: 7px 7px 13px #c7cbca, -7px -7px 13px #ffffff;
        @include p-num(10px);

        &:nth-child(4) {
          margin-right: 0;
        }
      }

      .container-case-box {
        width: 100%;
        @include flex(space-between, center, null);

        .container-case-item {
          width: 30%;
        }
      }

      .container-case-img {
        width: 100%;
        height: 500px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      // .info {
      //   width: calc(50% - 15px);
      // }
    }
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>

<style lang="scss">
.banner,
.container-product {
  .q-carousel__control {
    display: none;
  }
}
</style>
