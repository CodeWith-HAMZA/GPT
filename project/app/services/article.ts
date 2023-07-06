'use client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'




export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com' }),
    endpoints: (builder) => ({
        getArticleSummary: builder.query<{}, string>({





            query: (apiParams) => {
                return {
                    url: `/summarize`, headers: {
                        'X-RapidAPI-Key': '6f3e97e015mshd53ee240a428611p14e653jsn43fcb79a144f',
                        'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
                    },
                    params: { ...apiParams },


                    responseHandler: (response) => response.json(),


                }
            },
        }),
    }),
})


export const { useGetArticleSummaryQuery, useLazyGetArticleSummaryQuery } = articleApi


