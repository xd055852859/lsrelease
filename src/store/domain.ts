import { ref } from "vue";
import { defineStore } from "pinia";
import { Domain } from "@/interface/Common";

// 使用setup模式定义
export const domainStore = defineStore("domainStore", () => {
  const domain = ref<Domain | null>(null);
  const codeName = ref<string>("");
  const setDomain = (newDomain: Domain) => {
    domain.value = newDomain;
    localStorage.setItem("domain", JSON.stringify(newDomain));
  };
  const setCodeName = (newCodeName: string) => {
    codeName.value = newCodeName;
    localStorage.setItem("codeName", JSON.stringify(newCodeName));
  };
  return {
    domain,
    setDomain,
    codeName,
    setCodeName,
  };
});
