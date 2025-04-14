import { api } from '../api';
import { getBaseUrl } from '../api/const';
import { IBaseDataRes } from '../type';
import { IDecree, IDocument, IReference } from './type';

export const semester = 12;
export const week = 2937;

export const dashboardApi = api.injectEndpoints({
  endpoints: build => ({
    getDecree: build.mutation<IBaseDataRes<IDecree[]>, void>({
      query: () => ({
        url: getBaseUrl(`/student/decree`),
      }),
    }),

    getReference: build.mutation<IBaseDataRes<IReference[]>, void>({
      query: () => ({
        url: getBaseUrl(`/student/reference`),
      }),
    }),

    genReference: build.mutation<IBaseDataRes<IReference[]>, void>({
      query: () => ({
        url: getBaseUrl(`/student/reference-generate`),
      }),
    }),

    getDocument: build.mutation<IBaseDataRes<IDocument[]>, void>({
      query: () => ({
        url: getBaseUrl(`/student/document`),
      }),
    }),
  }),
});

export const {
  useGetDecreeMutation,
  useGetReferenceMutation,
  useGenReferenceMutation,
  useGetDocumentMutation,
} = dashboardApi;
