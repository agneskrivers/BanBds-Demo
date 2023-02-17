// Type
type NewsCompactForApp = Pick<INews, 'title' | 'thumbnail'>;
type NewsCompactForWebDashboard = Pick<INews, 'title'>;
type NewsCompactForWeb = Pick<
    INews,
    'title' | 'description' | 'thumbnail' | 'newsID'
>;
type NewsInfo = Pick<INews, 'title' | 'description' | 'content'>;

// Interfaces
interface NewsResultGetShortlistModeFirstForWeb {
    mode: 'first';
    top: INewsCompactModeSmallForWeb[] | null;
    mostViews: INewsCompactModeTitleForWeb[] | null;
    latests: INewsCompactForWeb[];
    pages: number;
}
interface NewsResultGetShortlistModeMoreForWeb {
    mode: 'more';
    latests: INewsCompactForWeb[];
}

// Export Type
export type IHotNewsCompactForApp = Omit<INewsCompactForApp, 'createdAt'> &
    Pick<INews, 'description'>;
export type IHotNewsCompactForWebDashboard = INewsCompactForWebDashboard &
    Pick<INews, 'content' | 'thumbnail'>;
export type INewsCompactModeSmallForWeb = Omit<
    INewsCompactForWeb,
    'description'
>;
export type INewsCompactModeTitleForWeb = Pick<
    INewsCompactForWeb,
    'id' | 'title' | 'link' | 'newsID'
>;
export type INewsResultGetShortlistForWeb =
    | NewsResultGetShortlistModeFirstForWeb
    | NewsResultGetShortlistModeMoreForWeb;

// Export Interface
export interface INews {
    newsID: number;

    title: string;
    description: string;
    content: string;
    thumbnail: string;
    images: string[];
    views: number;

    editor: string;
    creator: string;

    region: string;

    createdAt: Date;
    updatedAt: Date;
}
export interface INewsCompactForApp extends NewsCompactForApp {
    id: string;
    createdAt: number;
}
export interface INewsCompactForWebDashboard
    extends NewsCompactForWebDashboard {
    link: string;
    id: string;
}
export interface INewsCompactForWeb extends NewsCompactForWeb {
    id: string;
    link: string;
    time: number;
}
export interface INewsInfo extends NewsInfo {
    time: number;
}
export interface INewsResultGetForDashboardWeb {
    hot: IHotNewsCompactForWebDashboard;
    latests: INewsCompactForWebDashboard[];
}
export interface INewsResultGetInfoForWeb {
    data: INewsInfo;
    more: INewsCompactForWeb[] | null;
}
