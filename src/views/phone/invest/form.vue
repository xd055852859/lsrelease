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
import router from "@/router";
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
  tagKey: string;
  area: number;
  areaUnit: string;
  regionCode: string;
  regionArr: any;
  address: string;
  location: number[] | null;
  imageList: string[];
  conversionProof: string[];
  unused: boolean;
  valuation: number;
  describe: string;
  owner: string;
  ownerCode: string;
  proof: string[];
  propertyID: string;
  contact: string;
  purpose: string;
  propertyStatus: number;
  propertyNature: number;
  propertyType: number;
  contactAddress: string;
  detailAddress: string;
}
const props = defineProps<{
  investKey?: string;
}>();
const { domain } = storeToRefs(appStore.domainStore);
const formTab = ref<string>("base");
const tagVisible = ref<boolean>(false);
const inputRef = ref<HTMLElement | null>(null);
const locationVisible = ref<boolean>(false);
const rootKey = ref<string>("");
const tagTree = ref<any>({});
const tagList = computed(() => {
  if (rootKey.value && tagTree.value) {
    tagTree.value[rootKey.value].selectable = false;
    return [formatData(tagTree.value, rootKey.value)];
  }
});
const info = reactive<DataInterface>({
  _key: "",
  name: "",
  tagKey: "",
  area: 0,
  areaUnit: "平方米",
  regionCode: "",
  regionArr: null,
  address: "",
  location: null,
  imageList: [],
  conversionProof: [],
  unused: false,
  valuation: 0,
  describe: "",
  owner: "",
  ownerCode: "",
  proof: [],
  propertyID: "",
  contact: "",
  purpose: "",
  propertyStatus: 1,
  propertyNature: 1,
  propertyType: 1,
  contactAddress: "",
  detailAddress: "",
});

const baseInfo = ref<DataInterface | null>(null);
onMounted(() => {
  baseInfo.value = _.cloneDeep(info);
  if (props.investKey) {
    getInfo(props.investKey);
  }
});
const getInfo = async (key: string) => {
  if (key) {
    let dataRes = (await api.request.get("ecoResource/detail", {
      resourceKey: key,
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
    setMessage("error", "请输入资源名称");
    return;
  }
  if (!info.area) {
    setMessage("error", "请输入面积");
    return;
  }
  if (!info.tagKey) {
    setMessage("error", "请选择资源类型");
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
      if (props.investKey) {
        saveRes = (await api.request.patch("ecoResource", {
          resourceKey: props.investKey,
          ...info,
        })) as ResultProps;
      } else {
        saveRes = (await api.request.post("ecoResource", {
          ...info,
        })) as ResultProps;
      }
      if (saveRes.msg === "OK") {
        setMessage("success", "保存成功，请等待工作人员审核");
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
const deleteInvest = async () => {
  $q.dialog({
    title: `删除数据`,
    message: `请确定是否删除数据`,
    cancel: {
      color: "grey-5",
      flat: true,
    },
  })
    .onOk(async () => {
      const saveRes = (await api.request.delete("ecoResource/back", {
        resourceKey: props.investKey,
      })) as ResultProps;
      if (saveRes.msg === "OK") {
        setMessage("success", "删除成功");
        router.back();
      }
    })
    .onCancel(() => {});
};
const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, mimeType, async (url, name) => {
      switch (type) {
        case "base":
          console.log(info.imageList);
          console.log(url);
          info.imageList.push(url);
          break;
        case "message":
          info.proof.push(url);
          break;
      }
    });
  }
};
const setLocation = (
  lo: number,
  la: number,
  center: number[],
  zoom: number,
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
  { immediate: true },
);
</script>
<template>
  <div class="investForm">
    <div class="investForm-title dp-space-center">
      {{ investKey ? "编辑资源" : "新增资源" }}
      <div>
        <!-- <q-btn
          flat
          label="重置"
          @click="resetInvest()"
          class="q-mr-sm"
          color="grey-7"
          v-if="!investKey"
        /> -->
        <!-- <q-btn
          flat
          round
          icon="delete"
          @click="deleteInvest()"
          class="q-mr-sm"
          color="grey-5"
          v-if="investKey"
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
      <div v-show="formTab == 'base'">
        <div class="form-item">
          <div class="form-item-title">
            资源类型<span class="text-red q-ml-sm text-h6">*</span>
          </div>
          <div class="form-item-input" ref="inputRef">
            <div class="form-item-select icon-point">
              {{ tagTree[info.tagKey]?.name }}
              <q-icon
                name="arrow_drop_down"
                color="grey-7"
                style="margin-left: 8px"
                size="25px"
                class="select-icon"
              />
            </div>
            <q-menu
              :style="{ width: inputRef?.offsetWidth + 'px' }"
              v-model="tagVisible"
            >
              <q-tree
                v-model:selected="info.tagKey"
                :nodes="tagList"
                node-key="key"
                no-connectors
                default-expand-all
                no-transition
                style="width: 100%"
                @update:selected="
                  (target) => {
                    tagVisible = false;
                  }
                "
                v-if="tagList"
              ></q-tree>
            </q-menu>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">
            资源名称<span class="text-red q-ml-sm text-h6">*</span>
          </div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.name"
              required
              placeholder="请输入资源名称"
              :rules="[(val) => !!val || '资源名称必填']"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">
            资源面积<span class="text-red q-ml-sm text-h6">*</span>
          </div>
          <div class="form-item-input dp-space-center">
            <q-input
              dense
              outlined
              v-model="info.area"
              placeholder="请输入资源面积"
              :rules="[(val) => !!val || '资源面积必填']"
              class="q-pb-none q-mr-md"
              style="width: calc(100% - 130px)"
            />
            <q-select
              v-model="info.areaUnit"
              :options="['平方米', '亩']"
              dense
              class="no-border"
              style="width: 120px"
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
          <div class="form-item-title">位置信息</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.address"
              placeholder="请输入位置信息"
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
          <div class="form-item-title">资源图片</div>
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
                  uploadImage($event.target.files[0], 'base')
                "
                class="upload-img"
              />
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">是否闲置</div>
          <div class="form-item-input">
            <q-toggle v-model="info.unused" />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">资产估值</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.valuation"
              placeholder="请输入资产估值"
              class="full-width q-pb-none"
              type="number"
              :min="0"
            >
              <template v-slot:append>
                <div class="text-body2">万元</div>
              </template></q-input
            >
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">资源描述</div>
          <div class="form-item-box">
            <q-input
              type="textarea"
              dense
              outlined
              v-model="info.describe"
              placeholder="请输入资源描述"
              class="full-width q-pb-none"
            />
          </div>
        </div>
      </div>
      <div v-show="formTab == 'message'">
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
          <div class="form-item-title">权属单位代码</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.ownerCode"
              placeholder="请输入权属单位代码"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">权属证明文件</div>
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
            <div className="upload-button upload-img-button item-img-add">
              <q-icon name="add" style="color: #ebebeb" size="45px" />
              <input
                type="file"
                accept="image/*"
                @change="
                  //@ts-ignore
                  uploadImage($event.target.files[0], 'message')
                "
                class="upload-img"
              />
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">不动产证编号</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.propertyID"
              placeholder="请输入不动产证编号"
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
          <div class="form-item-title">用途</div>
          <div class="form-item-input">
            <q-input
              dense
              outlined
              v-model="info.purpose"
              placeholder="请输入用途"
              class="full-width q-pb-none"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">权属状态</div>
          <div class="form-item-input">
            <q-select
              outlined
              v-model="info.propertyStatus"
              :options="[
                { value: 1, label: '临时' },
                { value: 2, label: '现势' },
                { value: 3, label: '历史' },
                { value: 4, label: '终止' },
              ]"
              dense
              class="full-width"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">权属性质</div>
          <div class="form-item-input">
            <q-select
              outlined
              v-model="info.propertyNature"
              :options="[
                { value: 1, label: '国有土地' },
                { value: 2, label: '划拨' },
                { value: 3, label: '作价出资（入股）' },
                { value: 4, label: '租赁' },
                { value: 5, label: '私人' },
              ]"
              dense
              class="full-width"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">权利类型</div>
          <div class="form-item-input">
            <q-select
              outlined
              v-model="info.propertyType"
              :options="[
                { value: 1, label: '集体土地所有权' },
                { value: 2, label: '国家土地所有权' },
                { value: 3, label: '国有建设用地使用权' },
                { value: 4, label: '房屋所有权' },
                { value: 5, label: '宅基地使用权' },
              ]"
              dense
              class="full-width"
              emit-value
              map-options
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
          mapId="investMap"
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
    max-width: 1200px;
    height: 60px;
    @include flex(flex-start, center, null);
  }
  .investForm-box {
    width: 95vw;
    max-width: 1200px;
    height: calc(100vh - 180px);
    @include p-num(10px, 25px);
    @include scroll;
  }
}
</style>
<style lang="scss"></style>
