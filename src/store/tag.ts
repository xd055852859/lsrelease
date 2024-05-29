import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps, Tag } from "@/interface/Common";

// 使用setup模式定义
export const tagStore = defineStore("tagStore", () => {
  const circleTag = ref<Tag[]>([]);
  const newsTag = ref<Tag[]>([]);
  const circleIndex = ref<number>(100);
  const newsIndex = ref<number>(100);
  const getTag = async (type: string) => {
    const tagRes = (await api.request.get("tag", {
      tagType: type,
    })) as ResultProps;
    if (tagRes.msg === "OK") {
      if (type === "Blog") {
        circleTag.value = tagRes.data.map((item) => {
          return {
            _key: item._key,
            icon: item.icon,
            name: item.name,
            type: item.type,
          };
        });
      } else if (type === "News") {
        newsTag.value = tagRes.data.map((item) => {
          return {
            _key: item._key,
            icon: item.icon,
            name: item.name,
            type: item.type,
          };
        });
      }
    }
  };
  const setCircleIndex = async (index: number) => {
    circleIndex.value = index;
  };
  const setNewsIndex = async (index: number) => {
    newsIndex.value = index;
  };
  return {
    getTag,
    circleTag,
    circleIndex,
    setCircleIndex,
    newsTag,
    newsIndex,
    setNewsIndex,
  };
});
