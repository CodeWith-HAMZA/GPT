'use client'
import Image from 'next/image'
import { useGetArticleSummaryQuery, useLazyGetArticleSummaryQuery } from './services/article';
import { FormEvent, useEffect, useState } from 'react';

export default function Home() {
  const [AllArticles, setAllArticles] = useState([])
  const [Article, setArticle] = useState('')
  const [getArticleSummary, { data, error, isLoading, isFetching }] = useLazyGetArticleSummaryQuery()

  console.log(data, 'euu ', isLoading);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const url = formData.get("url")
    if (url) {

      try {
        const article = AllArticles.find(article => article.url === url)
        if (article) {
          return;
        }
        const { data, isLoading, isError, isSuccess, error } = await getArticleSummary({ url, length: 7 });
        setAllArticles([...AllArticles, { url, summary: data.summary }]);
        localStorage.setItem('articles', JSON.stringify([...AllArticles, { url, summary: data.summary }]))
        setArticle(data.summary)

      } catch (err) {
        console.log('error occured while fetching: ', err)

      }
    }


  }


  useEffect(() => {
    if (localStorage.getItem('articles')) {
      const articles = JSON.parse(localStorage.getItem('articles'));
      setAllArticles([...articles]);
      setArticle(articles.at(0).summary);
    }

  }, [])

  return (
    <>
      <section className=' p-3  '>
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="bg-gradient-to-r mt-16 mb-8 from-red-400 via-blue-500 to-green-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-6xl"
          >
            Modify Your Text On Your Own!

            <span className="sm:block">  </span>
          </h1>
          <p
            className="bg-gradient-to-r mt-8 mb-12 from-gray-500 via-gray-900 to-gray-700   bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
          >
            With Open AI Model GPT - 4

            <span className="sm:block">  </span>
          </p>




        </div>
        <div className="bg-white my-8">
          <form onSubmit={handleSubmit} className='flex shadow-lg  justify-between cursor-text px-3 py-1 gap-4'>
            <input type="url" name='url' className="  border-none outline-none w-full" placeholder='Enter URL' />
            <button type="submit" className='bg-black py-1.5 px-2 rounded-md w-40 text-gray-200 hover:text-gray-300' disabled={isLoading} >
              {
                isLoading || isFetching ?
                  <>
                    <span className='flex justify-center items-center gap-1 '>
                      <img src="/loading.gif" className='w-7 h-7' />
                    </span>
                  </> :
                  <span>Generate</span>
              }
            </button>
          </form>
        </div>
        <div className=" ">
          <div className="overflow-scroll max-h-[13.7rem] p-3">

            {AllArticles && [...AllArticles].map(
              ({ url, summary }) => <div onClick={() => {
                setArticle(summary)
              }} className="bg-white flex gap-2 items-center my-1.5 py-3 px-6 shadow-sm cursor-pointer hover:opacity-80 transition-all text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                <span>{url}</span>
              </div>
            )
            }
          </div>
          <div className="flex justify-between mt-16 mb-6 items-center">
            <h2
              className="bg-gradient-to-r   from-red-400 via-blue-500 to-green-600 bg-clip-text text-2xl font-bold   text-transparent sm:text-3xl"
            >
              Article Summary:


            </h2>
            <button className='mr-4 text-gray-700 hover:text-gray-500'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            </button>

          </div>
          <p className='text-lg bg-gradient-to-r bg-clip-text text-transparent from-gray-500 via-gray-800 to-gray-600'>{Article}</p>




        </div>

      </section>
    </>
  );
}
