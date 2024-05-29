import { User } from "@/interface/User";
import { Comment } from "./Common";

export interface Circle {
  _key: string;
  createTime: number;
  creatorInfo: User;
  hasFavor: boolean;
  imageList: string[];
  recommend: 0;
  summary: null | string;
  content?: string;
  tagInfo: { _key: string; name: string; allowComment: boolean };
  tagKey: string;
  viewNum: 0;
  commentList?: Comment[];
  type?: string;
}
export interface News {
  cover: string;
  createTime: number;
  creatorInfo: User;
  creator?: string;
  hasFavor: false;
  imageList: null | string[];
  recommend: number;
  summary: string;
  tagInfo: { _key: string; name: string; allowComment: null };
  tagKey: string;
  title: string;
  viewNum: number;
  content?: any;
  type?: string;
  commentList?: Comment[];
  _key: string;
}

