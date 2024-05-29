import { authStore } from "@/store/auth";
import { commonStore } from "@/store/common";
import { tagStore } from "@/store/tag";
import { domainStore } from "@/store/domain";
export interface IAppStore {
  authStore: ReturnType<typeof authStore>;
  commonStore: ReturnType<typeof commonStore>;
  tagStore: ReturnType<typeof tagStore>;
  domainStore: ReturnType<typeof domainStore>;
}

const appStore: IAppStore = {} as IAppStore;
/**
 * 注册app状态库
 */
export const registerStore = () => {
  appStore.authStore = authStore();
  appStore.commonStore = commonStore();
  appStore.tagStore = tagStore();
  appStore.domainStore = domainStore();
};

export default appStore;
