<script setup lang="ts">
import cDialog from "@/components/common/cDialog.vue";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { setMessage } from "@/services/util/common";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(appStore.authStore);
interface contactFormInterface {
  name: string;
  mobile: string;
  describe: string;
}
const info = ref<any>(null);
const props = defineProps<{
  productKey: string;
}>();
const imgIndex = ref<number>(0);
const contactVisible = ref<boolean>(false);
const contactForm = reactive<contactFormInterface>({
  name: "",
  mobile: "",
  describe: "",
});

const getData = async (key: string) => {
  const dataRes = (await api.request.get("product/detail", {
    productKey: key,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    info.value = dataRes.data;
  }
};
const saveForm = async () => {
  const dataRes = (await api.request.post("product/intention", {
    productKey: props.productKey,
    ...contactForm,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    setMessage("success", "保存产品意向成功");
    clearForm();
    contactVisible.value = false;
  }
};

const clearForm = () => {
  contactForm.name = "";
  contactForm.mobile = "";
  contactForm.describe = "";
};

watchEffect(() => {
  if (props.productKey) {
    getData(props.productKey);
  }
});
</script>
<template>
  <div class="investInfo">
    <div class="investInfo-box">
      <div class="investInfo-path">
        <q-breadcrumbs>
          <q-breadcrumbs-el
            label="资源信息"
            @click="$router.back()"
            class="icon-point"
          />
          <q-breadcrumbs-el label="产品详情" />
        </q-breadcrumbs>
        <div class="investInfo-button" v-if="user">
          <q-btn
            color="primary"
            label="我有意向"
            @click="contactVisible = true"
          />
        </div>
      </div>
      <div class="investInfo-box" v-if="info">
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
            <div class="form-item-title investInfo-subtitle">产品类型</div>
            <div class="form-item-input investInfo-input">{{ info.type }}</div>
          </div>
          <div class="form-item">
            <div class="form-item-title investInfo-subtitle">年产量</div>
            <div class="form-item-input investInfo-input">
              {{ info.production }} {{ info.productionUnit }}
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
            <div class="form-item-title investInfo-subtitle">产地</div>
            <div class="form-item-input investInfo-input">
              {{ info.address }}
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
        </div>
      </div>
    </div>
    <c-dialog
      :visible="contactVisible"
      title="意向"
      @close="contactVisible = false"
      :dialogStyle="{ width: '550px' }"
      class="dialog-transparent"
    >
      <template #content>
        <div class="form">
          <div class="form-item">
            <div class="form-item-title" style="width: 80px">姓名</div>
            <div class="form-item-input">
              <q-input
                dense
                outlined
                v-model="contactForm.name"
                placeholder="请输入姓名"
                class="full-width q-pb-none"
              />
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-title" style="width: 80px">手机号</div>
            <div class="form-item-input">
              <q-input
                dense
                outlined
                v-model="contactForm.mobile"
                placeholder="请输入手机号"
                class="full-width q-pb-none"
              />
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-title" style="width: 80px">留言</div>
            <div class="form-item-input">
              <q-input
                type="textarea"
                dense
                outlined
                v-model="contactForm.describe"
                placeholder="请输入留言"
                class="full-width q-pb-none"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <q-btn
          flat
          label="取消"
          color="grey-5"
          @click="
            contactVisible = false;
            clearForm();
          "
          :dense="true"
        />
        <q-btn label="保存" color="primary" @click="saveForm()" />
      </template>
    </c-dialog>
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
      @include flex(space-between, center, null);
    }
    .investInfo-box {
      width: 95vw;
      max-width: 1200px;
      max-height: calc(100vh - 120px);
      @include p-num(0px, 25px, 25px, 25px);
      @include scroll();
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
      .investInfo-form {
        width: 100%;
        // height: calc(100% - 400px);
      }
    }
  }
}
</style>
<style lang="scss"></style>
