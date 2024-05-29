<script setup lang="ts"  name="computernews">
import { ResultProps } from "@/interface/Common";
import { commonscroll } from "@/services/util/common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import newsItem from "@/components/newsItem.vue";
const { domain } = storeToRefs(appStore.domainStore);
const title = ref<string>("");
const industry = ref<string>("");
const newsList = ref<any>([]);
const page = ref<number>(1);
const total = ref<number>(0);

const getNews = async () => {
  const newsRes = (await api.request.get("news", {
    type: "新闻",
    industry: industry.value,
    title: title.value,
    page: page.value,
    limit: 50,
  })) as ResultProps;
  if (newsRes.msg === "OK") {
    if (page.value === 1) {
      newsList.value = [];
    }
    newsList.value = [...newsList.value, ...newsRes.data];
    total.value = newsRes.total as number;
  }
};
watch(industry, () => {
  page.value = 1;
});
watchEffect(() => {
  if (domain.value) {
    getNews();
  }
});
</script>
<template>
  <div class="news">
    <div class="news-box">
      <div class="news-left">
        <div
          class="news-left-item btn"
          @click="industry = ''"
          :class="{ 'choose-nav': industry === '' }"
        >
          全部
        </div>
        <div
          class="news-left-item btn"
          @click="industry = '农'"
          :class="{ 'choose-nav': industry === '农' }"
        >
          农产
        </div>
        <div
          class="news-left-item btn"
          @click="industry = '林'"
          :class="{ 'choose-nav': industry === '林' }"
        >
          林业
        </div>
        <div
          class="news-left-item btn"
          @click="industry = '牧'"
          :class="{ 'choose-nav': industry === '牧' }"
        >
          牧业
        </div>
        <div
          class="news-left-item btn"
          @click="industry = '水'"
          :class="{ 'choose-nav': industry === '水' }"
        >
          水利
        </div>
      </div>
      <div
        class="news-right"
        @scroll="
          commonscroll($event, newsList, total, () => {
            page++;
          })
        "
      >
        <template v-for="(item, index) in newsList" :key="'news' + index">
          <news-Item :item="item" />
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.news {
  width: 100vw;
  height: 100vh;
  padding-top: 80px;
  padding-bottom: 20px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include flex(center, null, wrap);
  .news-box {
    width: 95vw;
    max-width: 1500px;
    height: 100%;
    @include flex(space-between, null, null);
    .news-left {
      width: 120px;
      height: 100%;
      margin-right: 15px;
      position: relative;
      z-index: 1;
      .news-left-item {
        width: 100%;
        height: 40px;
        font-size: 14px;
        @include flex(center, center, null);
        cursor: pointer;
        flex-shrink: 0;
        margin-bottom: 10px;
      }
      .choose-nav {
        color: #fff;
        background-color: $commonColor;
        // color: $commonColor;
      }
    }
    .news-right {
      flex: 1;
      height: 100%;
      @include scroll();
      @include p-num(0px, 10px, 0px, 0px);
    }
  }
}
</style>
<style lang="scss"></style>
