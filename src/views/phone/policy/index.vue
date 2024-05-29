<script setup lang="ts" name="computernews">
import { ResultProps } from "@/interface/Common";
import { commonscroll } from "@/services/util/common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import newsItem from "@/components/newsItem.vue";
const { domain } = storeToRefs(appStore.domainStore);
const title = ref<string>("");
const industry = ref<string>("全部");
const newsList = ref<any>([]);
const page = ref<number>(1);
const total = ref<number>(0);

const getNews = async () => {
  const newsRes = (await api.request.get("news", {
    type: "政策",
    industry: industry.value !== "全部" ? industry.value : null,
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
      <div class="news-top">
        <div class="investForm-tab">
          <q-tabs
            v-model="industry"
            dense
            mobile-arrows
            active-color="primary"
            class="text-grey-7"
          >
            <q-tab name="全部" label="全部" />
            <q-tab name="农" label="农产" />
            <q-tab name="林" label="林业" />
            <q-tab name="牧" label="牧业" />
            <q-tab name="水" label="水利" />
            <q-tab name="文旅" label="文旅" />
          </q-tabs>
        </div>
      </div>
      <div
        class="news-bottom"
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
  height: 100%;
  padding-top: 80px;
  padding-bottom: 20px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include flex(center, null, wrap);
  .news-box {
    width: 95vw;
    max-width: 1200px;
    height: 100%;
    .news-top {
      width: 100%;
      height: 50px;
      margin-bottom: 10px;
    }
    .news-right {
      width: 100%;
      height: calc(100% - 60px);
      align-content: flex-start;
      @include scroll();
      @include p-num(0px, 10px, 0px, 0px);
    }
  }
}
</style>
<style lang="scss"></style>
