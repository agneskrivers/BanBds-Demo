// Interfaces
import type { IInvestor } from '@interfaces';

// Type
type ProjectCompactForAppKey =
    | 'title'
    | 'prices'
    | 'status'
    | 'type'
    | 'acreages';
type ProjectInfoKey =
    | 'acreages'
    | 'content'
    | 'overview'
    | 'type'
    | 'prices'
    | 'status'
    | 'title'
    | 'images';
type ProjectCompactForWebKey =
    | 'title'
    | 'type'
    | 'status'
    | 'acreages'
    | 'prices';
type ProjectCompactForWebDashboardKey =
    | 'title'
    | 'type'
    | 'status'
    | 'investor'
    | 'acreages'
    | 'prices';

type ProjectCompactForApp = Pick<IProject, ProjectCompactForAppKey>;
type ProjectInfo = Pick<IProject, ProjectInfoKey>;
type ProjectCompactForWeb = Pick<IProject, ProjectCompactForWebKey>;
type ProjectCompactForWebDashboard = Pick<
    IProject,
    ProjectCompactForWebDashboardKey
>;

// Interface
interface ProjectPriceByValue {
    min: number;
    max: number;
}

// Export Type
export type IProjectType = 'apartment' | 'land';
export type IProjectStatus = 'onSale' | 'openingSoon' | 'handedOver';

// Export Interface
export interface IProjectOverview {
    numberOfApartments: number;
    courtNumber: number;
    legal: string;
}
export interface IProjectLocation {
    region: string;
    district: string;
    ward: string;
    address: string;
    coordinate: IProjectLocationCoordinate;
}
export interface IProjectLocationCoordinate {
    latitude: number;
    longitude: number;
}
export interface IProject {
    projectID: number;

    title: string;
    content: string;

    acreages: string;
    prices: number | ProjectPriceByValue | null;

    location: IProjectLocation;

    type: IProjectType;
    status: IProjectStatus;

    investor: string | null;

    images: string[];
    overview: IProjectOverview | null;

    views: number;

    creator: string;
    editor: string | null;

    createdAt: Date;
    updatedAt: Date;
}
export interface IProjectCompactForWebDashboard
    extends ProjectCompactForWebDashboard {
    id: string;
    thumbnail: string;
    address: string;
    link: string;
}
export interface IProjectCompactForApp extends ProjectCompactForApp {
    id: string;
    image: string;
    company: string | null;
    address: string;
}
export interface IProjectCompactForWeb extends ProjectCompactForWeb {
    id: string;
    numberOfApartments: number | null;
    courtNumber: number | null;
    thumbnail: string;
    images: number;
    address: string;
    link: string;
    investor: IInvestor | null;
}
export interface IProjectInfo extends ProjectInfo {
    investor: IInvestor | null;
    address: string;
    coordinate: IProjectLocationCoordinate;
    link: string;
    id: string;
}
export interface IResultGetShortlistForApp {
    hot: IProjectCompactForApp | null;
    projects: IProjectCompactForApp[];
    pages: number;
}

export interface IProjectResultGetShortlistForWeb {
    projects: IProjectCompactForWeb[];
    pages: number;
    totals: number;
}
