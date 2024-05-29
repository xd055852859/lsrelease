<script setup lang="ts"  name="computerproduct">
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
const productList = ref<any[]>([]);
const townArray = ref<Region[]>([]);
const productName = ref<string>("");
const inputName = ref<string>("");
const townCode = ref<string>("");
const typeIndex = ref<number>(0);
const page = ref<number>(1);
const total = ref<number>(0);
const typeArray = ["农", "林", "牧", "渔"];

const getProduct = async () => {
  let obj: any = {
    name: productName.value,
    limit: 30,
    page: page.value,
  };
  if (townCode.value) {
    obj.regionCode = townCode.value;
  }
  if (typeIndex.value) {
    obj.type = typeArray[typeIndex.value - 1];
  }
  const productRes = (await api.request.get("product", {
    ...obj,
  })) as ResultProps;
  if (productRes.msg === "OK") {
    if (page.value === 1) {
      productList.value = [];
    }
    productList.value = [...productList.value, ...productRes.data];
    console.log(productList.value);
    total.value = productRes.total as number;
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

watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getRegion(newVal?.regionCode);
    }
  },
  { immediate: true }
);
watch([townCode, typeIndex], () => {
  page.value = 1;
});
watch(inputName, (newVal) => {
  if (!newVal) {
    productName.value = "";
    page.value = 1;
  }
});
watchEffect(() => {
  if (domain.value) {
    getProduct();
  }
});
</script>
<template>
  <div class="product">
    <div class="product-box">
      <div class="product-nav">
        <div class="nav-item">
          <div class="left">产品类型</div>
          <div class="right">
            <div
              @click="typeIndex = 0"
              :class="{ 'choose-item': typeIndex === 0 }"
            >
              全部
            </div>
            <div
              v-for="(item, index) in typeArray"
              :key="'work' + index"
              @click="typeIndex = index + 1"
              :class="{ 'choose-item': typeIndex === index + 1 }"
            >
              {{ item }}
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
      </div>
      <div class="product-search">
        <div class="dp--center">
          <q-input
            outlined
            v-model="inputName"
            placeholder="请输入产品关键词"
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
              productName = inputName;
              page = 1;
            "
          />
        </div>
        <q-btn
          color="primary"
          label="新增产品"
          @click="$router.push({ name: 'computerproductForm' })"
          v-if="user"
        />
      </div>
      <div
        class="product-container common-box"
        @scroll="
          commonscroll($event, productList, total, () => {
            page++;
          })
        "
      >
        <div
          class="common-info"
          v-for="(item, index) in productList"
          :key="'product' + index"
          @click="
            $router.push({
              name: 'computerproductInfo',
              params: { productKey: item._key },
            })
          "
        >
          <resource-Item :item="item" :tabType="'product'" v-if="item" />
        </div>
      </div>
      <div class="page">
        <!-- <el-pagination
          v-model:currentPage="page"
          background
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="
            (newPage) => {
              page = newPage;
              getproduct();
            }
          "
          :page-size="12"
          hide-on-single-page
        /> -->
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.product {
  width: 100vw;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include flex(center, null, wrap);
  .product-box {
    width: 95vw;
    max-width: 1500px;
    // max-width: 1500px;
    .product-nav {
      width: 100%;
      height: 90px;
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
    .product-search {
      width: 100%;
      height: 60px;
      margin: 10px 0px;
      @include flex(space-between, center, null);
    }
    .product-container {
      width: 100%;
      height: calc(100vh - 260px);
      align-content: flex-start;
      @include scroll();
    }
  }
}
</style>
<style></style>
