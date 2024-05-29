<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import cImage from "@/components/common/cImage.vue";
import cMap from "@/components/common/cMap.vue";
import { useQuasar } from "quasar";
import AMapLoader from "@amap/amap-jsapi-loader";
const $q = useQuasar();
const props = defineProps<{
  investKey: string;
}>();
const { domain } = storeToRefs(appStore.domainStore);
const formTab = ref<string>("base");
const imgIndex = ref<number>(0);
const info = ref<any>(null);
const typeArray = [
  { value: 1, label: "集体土地所有权" },
  { value: 2, label: "国家土地所有权" },
  { value: 3, label: "国有建设用地使用权" },
  { value: 4, label: "房屋所有权" },
  { value: 5, label: "宅基地使用权" },
];
const natureArray = [
  { value: 1, label: "国有土地" },
  { value: 2, label: "划拨" },
  { value: 3, label: "作价出资（入股）" },
  { value: 4, label: "租赁" },
  { value: 5, label: "私人" },
];
const hospitalArray = ref<any>([]);
const schoolArray = ref<any>([]);
const parkArray = ref<any>([]);
const hotelArray = ref<any>([]);
const getData = async (key: string) => {
  const dataRes = (await api.request.get("ecoResource/detail", {
    resourceKey: key,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    info.value = dataRes.data;
    let regionName = "";
    console.log();
    regionName =
      domain.value!.name +
      (info.value.regionArr
        ? `${
            info.value.regionArr.cityCode
              ? info.value.regionArr.cityCode.name
              : ""
          }${
            info.value.regionArr.districtCode
              ? info.value.regionArr.districtCode.name
              : ""
          }${
            info.value.regionArr.townCode
              ? info.value.regionArr.townCode.name
              : ""
          }`
        : "");
    console.log(regionName);
    getLocation(regionName);
  }
};
const getLocation = (cityName) => {
  AMapLoader.load({
    key: "70beeffb8fc9537f6d450fd3747b70c9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Geocoder", "AMap.PlaceSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap) => {
    let adCode = domain.value!.regionCode.substring(0, 6);
    AMap.plugin("AMap.Geocoder", function () {
      var geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: adCode,
      });

      geocoder.getLocation(cityName, function (status, locationResult) {
        if (status === "complete" && locationResult.info === "OK") {
          // result中对应详细地理坐标信息
          AMap.plugin(["AMap.PlaceSearch"], function () {
            let placeSearch = new AMap.PlaceSearch({
              pageSize: 50, // 每页10条
              pageIndex: 1, // 获取第一页
              // 指定城市名(如果你获取不到城市名称，这个参数也可以不传，注释掉)
            });
            // 第一个参数是关键字，这里传入的空表示不需要根据关键字过滤
            // 第二个参数是经纬度，数组类型
            // 第三个参数是半径，周边的范围
            // 第四个参数为回调函数
            getNear("医院", placeSearch, locationResult);
            getNear("学校", placeSearch, locationResult);
            getNear("公园", placeSearch, locationResult);
            getNear("酒店", placeSearch, locationResult);
          });
        }
      });
    });
  });
};
const getNear = (type, placeSearch, locationResult) => {
  placeSearch.searchNearBy(
    type,
    [
      locationResult.geocodes[0].location.lng,
      locationResult.geocodes[0].location.lat,
    ],
    2000,
    function (status, result) {
      if (result.info === "OK") {
        let locationList = result.poiList.pois; // 周边地标建筑列表
        console.log(locationList);
        switch (type) {
          case "医院":
            hospitalArray.value = locationList;
            break;
          case "学校":
            schoolArray.value = locationList;
            break;
          case "公园":
            parkArray.value = locationList;
            break;
          case "酒店":
            hotelArray.value = locationList;
            break;
        }
        //type
        //医疗保健服务;综合医院;综合医院  医院
        //风景名胜;公园广场;公园
        //住宿服务;宾馆酒店;宾馆酒店
        //科教文化服务;学校;成人教育
      } else {
        console.log("获取位置信息失败!");
      }
    },
  );
};
watchEffect(() => {
  if (domain.value && props.investKey) {
    getData(props.investKey);
  }
});
</script>
<template>
  <div class="investInfo">
    <div class="investInfo-box">
      <div class="investInfo-path dp-space-center">
        <q-breadcrumbs>
          <q-breadcrumbs-el
            label="资源信息"
            @click="$router.back()"
            class="icon-point"
          />
          <q-breadcrumbs-el label="资源详情" />
        </q-breadcrumbs>
      </div>
      <div class="investInfo-tab">
        <q-tabs v-model="formTab" active-color="primary" class="text-grey-7">
          <q-tab name="base" label="基本信息" />
          <q-tab name="message" label="权益信息" />
          <q-tab name="outside" label="周边环境" />
        </q-tabs>
      </div>
      <div class="investInfo-box" v-if="info">
        <template v-if="formTab === 'base'">
          <div class="investInfo-title">{{ info.name }}</div>
          <div
            class="investInfo-img"
            v-if="info.imageList && info.imageList.length > 0"
          >
            <q-carousel
              v-model="imgIndex"
              animated
              transition-prev="slide-right"
              transition-next="slide-left"
              swipeable
              control-color="white"
              navigation
              arrows
              height="250px"
              infinite
              autoplay
            >
              <q-carousel-slide
                class="q-pa-none"
                v-for="(item, index) in info.imageList"
                :key="`img${index}`"
                :name="index"
              >
                <div class="investInfo-img-item">
                  <img :src="item" alt="" />
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>
          <div class="investInfo-form form">
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">资源类型</div>
              <div class="form-item-input investInfo-input">
                {{ info.tagInfo?.name }}
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">资源面积</div>
              <div class="form-item-input investInfo-input">
                {{ info.area }}{{ info.areaUnit }}
              </div>
            </div>
            <div class="form-item" v-if="info.waterArea">
              <div class="form-item-title investInfo-subtitle">水体面积</div>
              <div class="form-item-input investInfo-input">
                {{ info.waterArea }}平方米
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">资源估值</div>
              <div class="form-item-input investInfo-input">
                {{ info.valuation ? info.valuation + " 万元" : "" }}
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">所属行政区</div>
              <div class="form-item-input investInfo-input">
                {{
                  info.regionArr
                    ? `${
                        info.regionArr.cityCode
                          ? info.regionArr.cityCode.name
                          : ""
                      } ${
                        info.regionArr.districtCode
                          ? info.regionArr.districtCode.name
                          : ""
                      } ${
                        info.regionArr.townCode
                          ? info.regionArr.townCode.name
                          : ""
                      } ${
                        info.regionArr.villageCode
                          ? info.regionArr.villageCode.name
                          : ""
                      }`
                    : ""
                }}
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">地址</div>
              <div class="form-item-input investInfo-input">
                {{ info.address }}
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">是否闲置</div>
              <div class="form-item-input investInfo-input">
                {{ info.unused ? "闲置" : "未闲置" }}
              </div>
            </div>
            <div class="form-item">
              <div
                class="form-item-title investInfo-subtitle"
                style="width: 100%"
              >
                产品描述
              </div>
              <div class="form-item-input investInfo-textarea">
                {{ info.describe }}
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">转换证明</div>
              <div class="investInfo-file">
                <div
                  class="q-pa-none icon-point"
                  v-for="(item, index) in info.conversionProof"
                  :key="`conversion${index}`"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="formTab === 'message'">
          <div class="investInfo-form form">
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">权属性质</div>
              <div class="form-item-input">
                {{ natureArray[info.propertyNature - 1].label }}
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">权利类型</div>
              <div class="form-item-input">
                {{ typeArray[info.propertyType].label }}
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">权益人</div>
              <div class="form-item-input">{{ info.owner }}</div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">联系方式</div>
              <div class="form-item-input">{{ info.contact }}</div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">
                权属证明文件
              </div>
              <div class="form-item-img">
                <div
                  class="item-img"
                  v-for="(item, index) in info.proof"
                  :key="`imageDetail${index}`"
                >
                  <q-icon
                    name="cancel"
                    size="18px"
                    class="item-img-close text-white icon-point"
                    @click="info.proof.splice(index, 1)"
                  />
                  <c-image :src="item" :list="info.proof" :isPreview="true" />
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">
                不动产证编号
              </div>
              <div class="form-item-input">{{ info.propertyID }}</div>
            </div>

            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">用途</div>
              <div class="form-item-input">{{ info.purpose }}</div>
            </div>

            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">通讯地址</div>
              <div class="form-item-input">{{ info.contactAddress }}</div>
            </div>
            <div class="form-item">
              <div class="form-item-title investInfo-subtitle">详细地址</div>
              <div class="form-item-input">{{ info.detailAddress }}</div>
            </div>
          </div>
        </template>
        <template v-else-if="formTab === 'outside'">
          <div
            :style="{ width: '100%', height: '300px' }"
            v-if="info.location && info.location[0] && info.location[1]"
          >
            <c-map
              mapId="resourceMap"
              :location="{ lng: info.location[0], lat: info.location[1] }"
            />
          </div>
          <div class="outside-item" v-if="info.address">
            <div class="investInfo-title">位置信息</div>
            <div class="outside-location">
              <div>{{ info.address }}</div>
            </div>
          </div>
          <div class="outside-item" v-if="hospitalArray.length > 0">
            <div class="investInfo-title">周边医院</div>
            <div
              v-for="(item, index) in hospitalArray"
              :key="'hospital' + index"
              class="outside-location"
            >
              <div>{{ item.name }}</div>
              <div>{{ item.distance }} 米</div>
            </div>
          </div>
          <div class="outside-item" v-if="schoolArray.length > 0">
            <div class="investInfo-title">周边学校</div>
            <div
              v-for="(item, index) in schoolArray"
              :key="'school' + index"
              class="outside-location"
            >
              <div>{{ item.name }}</div>
              <div>{{ item.distance }} 米</div>
            </div>
          </div>

          <div class="outside-item" v-if="parkArray.length > 0">
            <div class="investInfo-title">周边公园</div>
            <div
              v-for="(item, index) in parkArray"
              :key="'park' + index"
              class="outside-location"
            >
              <div>{{ item.name }}</div>
              <div>{{ item.distance }} 米</div>
            </div>
          </div>
          <div class="outside-item" v-if="hotelArray.length > 0">
            <div class="investInfo-title">周边酒店</div>
            <div
              v-for="(item, index) in hotelArray"
              :key="'hotal' + index"
              class="outside-location"
            >
              <div>{{ item.name }}</div>
              <div>{{ item.distance }} 米</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.investInfo {
  width: 100vw;
  height: 100vh;
  align-content: flex-start;
  @include p-num(50px, 0px, 0px);
  @include flex(center, null, wrap);
  .investInfo-box {
    width: 95vw;
    max-width: 1200px;
    .investInfo-path {
      width: 100%;
      height: 50px;
      color: #000000;
    }
    .investInfo-img {
      width: 100%;
      height: 250px;
      .investInfo-img-item {
        width: 100%;
        height: 250px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    .investInfo-tab {
      width: 95vw;
      max-width: 1200px;
      height: 60px;
      @include flex(flex-start, center, null);
    }
    .investInfo-box {
      width: 95vw;
      max-width: 1200px;
      height: calc(100vh - 180px);
      @include p-num(0px, 25px, 25px, 25px);
      @include scroll;
      .investInfo-title {
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 22px;
        color: #000000;
        font-weight: bold;
      }
      .investInfo-subtitle {
        width: 140px;
        font-size: 18px;
        font-weight: bold;
      }
      .investInfo-input,
      .investInfo-textarea {
        font-size: 16px;
      }
      .investInfo-file {
        width: calc(100% - 140px);
        > div {
          width: 100%;
          height: 45px;
          font-size: 16px;
        }
      }
      .investInfo-form {
        height: auto;
      }
      .outside-item {
        width: 100%;
        .outside-location {
          width: 100%;
          height: 35px;
          line-height: 35px;
          font-size: 14px;
          color: $grey-8;
          @include flex(space-between, center, null);
        }
      }
    }
  }
}
</style>
<style lang="scss"></style>
