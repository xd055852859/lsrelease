<script setup lang="ts" name="computerproduct">
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
const productList = ref<any[]>([]);
const townArray = ref<Region[]>([]);
const productName = ref<string>("");
const inputName = ref<string>("");
const townCode = ref<string>("");
const type = ref<string>("");
const page = ref<number>(1);
const total = ref<number>(0);
const boxRef = ref<any>(null);
const height = ref<number>(0);
const typeArray = ["农", "林", "牧", "渔"];
// onMounted(() => {
//   height.value = boxRef.value.offsetHeight;
//   console.log(height.value);
// });
const getProduct = async () => {
  let obj: any = {
    name: productName.value,
    limit: 30,
    page: page.value,
  };
  if (townCode.value) {
    obj.regionCode = townCode.value;
  }
  if (type.value) {
    obj.type = type.value;
  }
  const productRes = (await api.request.get("product", {
    ...obj,
  })) as ResultProps;
  if (productRes.msg === "OK") {
    if (page.value === 1) {
      productList.value = [];
    }
    productList.value = [...productList.value, ...productRes.data];
    total.value = productRes.total as number;
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

watch(
    domain,
    (newVal, oldVal) => {
      if (newVal?.regionCode && !oldVal) {
        getRegion(newVal?.regionCode);
      }
    },
    {immediate: true}
);
watch([townCode, type], () => {
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
    <div class="product-box" ref="boxRef">
      <div class="product-nav">
        <q-select
            outlined
            dense
            v-model="type"
            label="产品类型"
            class="q-mr-sm q-mb-sm"
            style="width: 42%"
            clearable
            :options="typeArray"
        />
      </div>
      <div class="product-region">
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

      <div class="product-search dp-center-center">
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
            class="q-mr-sm"
            @click="
            productName = inputName;
            page = 1;
          "
        />
      </div>
    </div>
    <div
        class="product-container common-box"
        :style="{ height: `calc(100% - ${height}px)` }"
        @scroll="
        commonscroll($event, productList, total, () => {
          page++;
        })
      "
        v-if="boxRef"
    >
      <div
          class="common-info"
          v-for="(item, index) in productList"
          style="width: 100%; margin-right: 0px"
          :key="'product' + index"
          @click="
          $router.push({
            name: 'phoneproductInfo',
            params: { productKey: item._key },
          })
        "
      >
        <resource-Item :item="item" :tabType="'product'" v-if="item"/>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.product {
  width: 100vw;
  height: 100%;
  padding-top: 60px;
  box-sizing: border-box;
  background: #f5f5f5;
  align-content: flex-start;
  @include flex(center, null, wrap);

  .product-box {
    width: 95vw;
    max-width: 1200px;
    flex-shrink: 0;
    margin-bottom: 15px;
    // max-width: 1200px;
    .product-nav {
      width: 100%;
      @include flex(flex-start, center, wrap);
    }

    .product-region {
      width: 100%;
      @include flex(flex-start, center, wrap);
    }

    .product-search {
      width: 100%;
      height: 60px;
      @include flex(flex-start, center, wrap);
    }
  }

  .product-container {
    width: 95vw;
    max-width: 1200px;
    align-content: flex-start;
    @include scroll();
  }
}
</style>
<style></style>
