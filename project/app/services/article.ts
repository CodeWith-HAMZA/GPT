"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// API - Article Extractor and Summarizer
// https://rapidapi.com/restyler/api/article-extractor-and-summarizer/
const RAPID_API_KEY = "349de7157cmshff68522ae3d1284p1921c6jsne2e377f316fa";
const RAPID_API_HOST = "article-extractor-and-summarizer.p.rapidapi.com";

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com",
    // * Setting Headers For The Current API-endpoints-Groups
    prepareHeaders(headers, api) {
      headers.set("X-RapidAPI-Key", RAPID_API_KEY);
      headers.set("X-RapidAPI-Host", RAPID_API_HOST);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getArticleSummary: builder.query<
      { url: string; summary: string },
      { url: string; length: number }
    >({
      query: ({ url, length }) => ({
        url: "/summarize",
        params: { url, length },
      }),
    }),
    getArticleSummaryOfGivenParagraph: builder.mutation<
      { url: string; summary: string },
      { lang: string; text: string; length: number }
    >({
      query: ({ lang, text, length }) => ({
        url: "/summarize-text",
        method: "POST",
        body: { lang, text, length },
      }),
    }),
  }),
});

export const {
  useGetArticleSummaryQuery,
  useLazyGetArticleSummaryQuery,
  useGetArticleSummaryOfGivenParagraphMutation,
} = articleApi;
