import { Comment } from "./Common";
import { User } from "./User";

export interface Resource {
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
  unused: boolean;
  valuation: number;
  describe: string;
  status: boolean | number;
  owner: string;
  ownerCode: string;
  proof: string[];
  propertyID: string;
  contact: string;
  purpose: string;
  isStatus: boolean;
  propertyStatus: number;
  propertyNature: number;
  propertyType: number;
  contactAddress: string;
  detailAddress: string;
  investmentProject: boolean;
  keyProject: boolean;
  investmentObjective: string[];
  investmentAmount: string;
  operatingRent: string;
  targetAmount: string;
  plannedStartDate: number | null;
  plannedEndDate: number | null;
  projectSummary: string;
}
export interface ResourceInfo extends Resource {
  contactsInfo: User;
  tagKey: string;
  uploadTime: number;
  uploadUser: string;
  _key: string;
  offerNum?: number;
}