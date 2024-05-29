<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { uploadFile } from "@/services/util/file";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import cImage from "@/components/common/cImage.vue";
import cDialog from "@/components/common/cDialog.vue";
import { formatData } from "@/services/util/data";
import MapMenu from "@/components/mapMenu.vue";
import SelectRegion from "@/components/selectRegion.vue";
import { setMessage } from "@/services/util/common";
import { useQuasar } from "quasar";
import _ from "lodash";
const $q = useQuasar();
interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
interface DataInterface {
  _key?: string;
  name: string;
  type: string;
  regionCode: string;
  regionArr: any;
  address: string;
  location: number[] | null;
  imageList: string[];
  production: number;
  productionUnit: string;
  describe: string;
  owner: string;
  contact: string;
  contactAddress: string;
  detailAddress: string;
}
const props = defineProps<{
  productKey?: string;
}>();
const { domain } = storeToRefs(appStore.domainStore);
const formTab = ref<string>("base");
const locationVisible = ref<boolean>(false);
const rootKey = ref<string>("");
const tagTree = ref<any>({});
const tagList = computed(() => {
  if (rootKey.value && tagTree.value) {
    return [formatData(tagTree.value, rootKey.value)];
  }
});
const info = reactive<DataInterface>({
  _key: "",
  name: "",
  type: "农",
  regionCode: "",
  regionArr: null,
  address: "",
  location: null,
  imageList: [],
  productionUnit: "",
  production: 0,
  describe: "",
  owner: "",
  contact: "",
  contactAddress: "",
  detailAddress: "",
});
const baseInfo = ref<DataInterface | null>(null);
onMounted(() => {
  baseInfo.value = _.cloneDeep(info);
  console.log(props.productKey);
  if (props.productKey) {
    getInfo(props.productKey);
  }
});

const getInfo = async (key: string) => {
  if (key) {
    let dataRes = (await api.request.get("product/detail", {
      productKey: key,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      Object.assign(info, dataRes.data);
    }
  } else {
    Object.assign(info, baseInfo.value);
  }
};
const getTag = async () => {
  const tagRes = (await api.request.get("resourceTag/tree")) as ResultProps;
  if (tagRes.msg === "OK") {
    tagTree.value = tagRes.data;
    //@ts-ignore
    rootKey.value = tagRes.rooter._key;
  }
};
const saveInvest = () => {
  if (!info.name) {
    setMessage("error", "请输入产品名称");
    return;
  }
  if (info.regionCode === domain.value!.regionCode) {
    setMessage("error", "请选择所属行政区");
    return;
  }
  $q.dialog({
    title: `保存数据`,
    message: `请确定基本信息和权益信息都已填写完毕`,
    cancel: {
      color: "grey-5",
      flat: true,
    },
  })
    .onOk(async () => {
      let saveRes: any = null;
      if (props.productKey) {
        saveRes = (await api.request.patch("product", {
          productKey: props.productKey,
          ...info,
        })) as ResultProps;
      } else {
        saveRes = (await api.request.post("product", {
          ...info,
        })) as ResultProps;
      }

      if (saveRes.msg === "OK") {
        setMessage("success", "保存成功");
      }
    })
    .onCancel(() => {});
};
const resetInvest = () => {
  $q.dialog({
    title: `重置数据`,
    message: `是否重置数据`,
    cancel: {
      color: "grey-5",
      flat: true,
    },
  })
    .onOk(async () => {
      getInfo("");
    })
    .onCancel(() => {});
};
const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, mimeType, async (url, name) => {
      info.imageList.push(url);
    });
  }
};
const setLocation = (
  lo: number,
  la: number,
  center: number[],
  zoom: number
) => {
  info.location = [lo, la];
};
watch(
  domain,
  (newDomain) => {
    if (newDomain) {
      info.regionCode = newDomain.regionCode;
      getTag();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="investForm">
    <div class="investForm-title dp-space-center">
      {{ productKey ? "编辑产品" : "新增产品" }}
      <div>
        <!-- <q-btn
          flat
          label="重置"
          @click="resetInvest()"
          class="q-mr-sm"
          color="grey-7"
          v-if="!productKey"
        /> -->
        <q-btn color="primary" label="保存资源" @click="saveInvest()" />
      </div>
    </div>
    <div class="investForm-tab">
      <q-tabs v-model="formTab" active-color="primary" class="text-grey-7">
        <q-tab name="base" label="基本信息" />
        <q-tab name="message" label="权益信息" />
      </q-tabs>
    </div>
    <div class="investForm-box form">
      <div v-show="formTab === 'base'">
        <div class="form-item">
          <div class="form-item-title">
            产品类型<span class="text-red q-ml-sm text-h6">*</span>
          </div>
          <div class="form-item-input">
            <q-select
              v-model="info.type"
              :options="['农', '林', '牧', '渔']"
              dense
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">
            产品名称<span class="text-red q-ml-sm text-h6">*</span>
          </div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.name"
              required
              placeholder="请输入产品名称"
              :rules="[(val) => !!val || '产品名称必填']"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">
            所属行政区<span class="text-red q-ml-sm text-h6">*</span>
          </div>
          <div class="form-item-input" v-if="domain">
            <template v-if="info._key">
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
            </template>
            <SelectRegion
              :regionCode="info.regionCode"
              @setCode="
                (obj, code) => {
                  info.regionArr = obj;
                  info.regionCode = code;
                }
              "
              v-else-if="info.regionCode"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">产地</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.address"
              placeholder="请输入产地"
              class="full-width q-pb-none"
            />
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">地理坐标</div>
          <div
            class="form-item-input icon-point"
            @click="locationVisible = true"
          >
            <q-btn color="primary" label="地图选点" v-if="!info.location" />
            <template v-else>
              经度:{{ info.location[0] }} , 纬度:{{
                info.location[1]
              }}</template
            >
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">产品图片</div>
          <div class="form-item-img">
            <div
              class="item-img"
              v-for="(item, index) in info.imageList"
              :key="`imageDetail${index}`"
            >
              <q-icon
                name="cancel"
                size="18px"
                class="item-img-close text-white icon-point"
                @click="info.imageList.splice(index, 1)"
              />
              <c-image :src="item" :list="info.imageList" :isPreview="true" />
            </div>
            <div className="upload-button upload-img-button item-img-add">
              <q-icon name="add" style="color: #ebebeb" size="45px" />
              <input
                type="file"
                accept="image/*"
                @change="
                  //@ts-ignore
                  uploadImage($event.target.files[0])
                "
                class="upload-img"
              />
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">年产量</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.production"
              placeholder="请输入年产量"
              class="full-width q-pb-none"
              type="number"
              :min="0"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">年产量单位</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.productionUnit"
              placeholder="请输入年产量单位"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">产品描述</div>
          <div class="form-item-box">
            <q-input
              type="textarea"
              dense
              outlined
              v-model="info.describe"
              placeholder="请输入产品描述"
              class="full-width q-pb-none"
            />
          </div>
        </div>
      </div>
      <div v-show="formTab === 'message'">
        <div class="form-item">
          <div class="form-item-title">权益人/权属单位</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.owner"
              placeholder="请输入权益人/权属单位"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">联系方式</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.contact"
              placeholder="请输入联系方式"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">通讯地址</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.contactAddress"
              placeholder="请输入通讯地址"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">详细地址</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.detailAddress"
              placeholder="请输入详细地址"
              class="full-width q-pb-none"
            />
          </div>
        </div>
      </div>
    </div>
    <c-dialog
      :visible="locationVisible"
      title="地图选点"
      @close="locationVisible = false"
      :dialogStyle="{ width: '730px', maxWidth: '800px' }"
      class="dialog-transparent"
    >
      <template #content>
        <MapMenu
          mapId="productMap"
          :location="info.location"
          :width="700"
          :height="600"
          @setLocation="setLocation"
        />
      </template>
    </c-dialog>
  </div>
</template>
<style scoped lang="scss">
.investForm {
  width: 100vw;
  height: 100vh;
  align-content: flex-start;
  @include p-num(50px, 0px, 0px);
  @include flex(center, null, wrap);
  .investForm-title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    font-weight: 600;
    color: #000000;
    @include p-num(0px, 20px);
  }
  .investForm-tab {
    width: 95vw;
    max-width: 1500px;
    height: 60px;
    @include flex(flex-start, center, null);
  }
  .investForm-box {
    width: 95vw;
    max-width: 1500px;
    height: calc(100vh - 180px);
    @include p-num(10px, 25px);
    @include scroll;
  }
}
</style>
<style lang="scss"></style>
