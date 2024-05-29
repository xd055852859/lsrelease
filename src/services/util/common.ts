
import { Notify, Loading } from "quasar";
import { is_mobile } from "./util";
import { domainStore } from "@/store/domain";
export const setMessage = (type: string, text: string) => {
  let icon: string = "";
  let color: string = "";
  switch (type) {
    case "success":
      icon = "done";
      color = "positive";
      break;
    case "error":
      icon = "error";
      color = "negative";
      break;
    case "warning":
      icon = "warning";
      color = "warning";
      break;
  }
  Notify.create({
    icon: icon,
    color: color,
    message: text,
    position: "top",
    badgeStyle: { display: "none" },
  });
};
export const setLoading = (visible: boolean) => {
  visible ? Loading.show() : Loading.hide();
};
export const commonscroll = (e, list, total, callback) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (height + scrollTop >= scrollHeight && list.length < total) {
    callback();
  }
};
export const login = () => {
  let redirect = encodeURIComponent(`${window.location.href}`);
  localStorage.clear();
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?app=10&apphigh=55&logo=${
    domainStore().domain!.logo
  }&redirect=${redirect}`;
  if (is_mobile()) {
    window.open(href);
  } else {
    window.open(href, "_self");
  }
};