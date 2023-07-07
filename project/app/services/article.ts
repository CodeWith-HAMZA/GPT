"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com",
  }),
  endpoints: (builder) => ({
    getArticleSummary: builder.query<
      { url: string; summary: string },
      { url: string; length: number }
    >({
      query: (apiParams) => {
        return {
          url: `/summarize`,
          headers: {
            "X-RapidAPI-Key":
              "889d2e1235mshffe1aba3d372808p1e8586jsnca3b7d74e587",
            "X-RapidAPI-Host":
              "article-extractor-and-summarizer.p.rapidapi.com",
          },
          params: { url: apiParams.url, length: apiParams.length },
          responseHandler: (response) => {
            console.log(response);
            return response.json();
          },
        };
      },
    }),
    getArticleSummaryOfGivenParagraph: builder.mutation<
      { url: string; summary: string },
      { lang: string; text: string }
    >({
      query: ({ lang, text }) => {
        return {
          url: "/summarize-text",
          headers: {
            "X-RapidAPI-Key":
              "889d2e1235mshffe1aba3d372808p1e8586jsnca3b7d74e587",
            "X-RapidAPI-Host":
              "article-extractor-and-summarizer.p.rapidapi.com",
          },
          method: "POST",
          body: {
            lang,
            text,
          },
          responseHandler: (response) => response.json(),
        };
      },
    }),
  }),
});

export const {
  useGetArticleSummaryQuery,
  useLazyGetArticleSummaryQuery,
  useGetArticleSummaryOfGivenParagraphMutation,
} = articleApi;
