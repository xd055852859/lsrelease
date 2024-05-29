<script setup lang="ts">
import { News } from "@/interface/Circle";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { setMessage } from "@/services/util/common";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const { deviceType } = storeToRefs(appStore.commonStore);
const dayjs: any = inject("dayjs");
const props = defineProps<{
  item: News;
}>();
const emits = defineEmits<{
  (e: "changeItem", item: any): void;
}>();
const setFavor = async (e, favor: boolean) => {
  e.stopPropagation();
  const replyRes = (await api.request.post("favor", {
    articleKey: props.item._key,
  })) as ResultProps;
  if (replyRes.msg === "OK") {
    setMessage("success", favor ? "点赞成功" : "取消点赞成功");
    emits("changeItem", { _key: props.item._key, hasFavor: favor });
  }
};
</script>
<template>
  <div
    class="news-item"
    @click="
      $router.push({
        name: `${deviceType}newsInfo`,
        params: { newsKey: item._key },
      })
    "
  >
    <div
      class="left"
      :style="{ width: deviceType === 'phone' ? '150px' : '25%' }"
    >
      <img :src="item.cover" alt="" v-if="item.cover" />
      <div v-else class="left-default">
        <img src="/default.png" alt="" />
      </div>
    </div>
    <div class="right">
      <div class="news-title single-to-long">{{ item.title }}</div>
      <div class="news-summary">{{ item.summary }}</div>
      <div class="news-button">
        <div>{{ dayjs(item.createTime).fromNow() }}</div>
        <!-- <div class="dp--center">
          <template v-if="user">
            <iconpark-icon
              name="likeFilled"
              style="margin-right: 8px"
              v-if="item.hasFavor"
              @click="setFavor($event, false)"
            />
            <iconpark-icon
              name="like"
              style="margin-right: 8px"
              v-else
              @click="setFavor($event, true)"
            />
          </template> 
<iconpark-icon name="eye" style="margin-right: 8px" />{{
            item.viewNum
          }} 
        </div>-->
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.news-item {
  width: 100%;
  height: 140px;
  margin-bottom: 15px;
  background-color: #fff;
  @include flex(space-between, center, null);
  &:hover {
    box-shadow: 0px 2px 10px 0px rgba(141, 141, 141, 0.5);
  }
  .left {
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
    img {
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
    flex: 1;
    height: 100%;
    padding: 15px;
    flex-shrink: 0;
    box-sizing: border-box;
    .news-title {
      width: 100%;
      font-size: 16px;
    }
    .news-summary {
      width: 100%;
      height: 40px;
      color: #9c9c9c;
      font-size: 14px;
      margin: 10px 0px 20px 0px;
      line-height: 20px;
      @include more-toLong(2);
    }
    .news-button {
      color: #9c9c9c;
      font-size: 14px;
      @include flex(flex-end, center, null);
    }
  }
}
</style>
