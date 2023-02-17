/* eslint-disable no-useless-escape */
// Helpers
import { convertToEnglish } from '@server/helpers';

// Function Type
type GetLinkConvertTitle = (title: string) => string;
type GetLinkNews = (title: string, newsID: number) => string;
type GetLinkPost = (title: string, postID: number) => string;
type GetLinkProject = (title: string, projectID: number) => string;

const convertTitle: GetLinkConvertTitle = (title) =>
    convertToEnglish(decodeURI(title))
        .replace(/[\.,~()/\?%*]/g, '')
        .replace(/\s/g, '-');

const news: GetLinkNews = (title, newsID) =>
    `/tin-tuc/${convertTitle(title)}-${newsID}`;

const post: GetLinkPost = (title, postID) =>
    `/tin-dang/${convertTitle(title)}-${postID}`;

const project: GetLinkProject = (title, projectID) =>
    `/du-an/${convertTitle(title)}-${projectID}`;

export default { news, post, project };
