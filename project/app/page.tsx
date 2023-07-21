"use client";
import { getLocalStorage } from "@/utils/helpers";
import {
  useGetArticleSummaryOfGivenParagraphMutation,
  useLazyGetArticleSummaryQuery,
} from "./services/article";
import { FormEvent, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Dropdown from "@/app/components/client/Dropdown";
const ServicesWithHeading = {
  summarize: "Summarize Through Link",
  "summarize-text": "Summarize Through Given Paragraph",
  extract: "Extract Useful Information",
};
type Services = "summarize" | "summarize-text" | "extract";
export default function Home() {
  const [AllArticles, setAllArticles] = useState<Article[]>([]);
  const [Article, setArticle] = useState<string>("");
  const [Service, setService] = useState<Services>("summarize-text");
  const [Speaking, setSpeaking] = useState<boolean>(false);

  const [getArticleSummary, { data, error, isLoading, isFetching }] =
    useLazyGetArticleSummaryQuery();
  const [
    getArticleSummaryOfGivenParagraph,
    { isLoading: isPosting, isError: postError, error: postErrorData },
  ] = useGetArticleSummaryOfGivenParagraphMutation();

  console.log(data, "euu ", isLoading);
  async function getArticleSummaryByURL(url: string, length: number) {
    try {
      const article = AllArticles.find((article) => article.url === url);
      if (article) {
        return;
      }
      const res = await getArticleSummary({
        url,
        length,
      });
      console.log(res, "data, eu");
      setAllArticles([
        ...AllArticles,
        { url, summary: res?.data?.summary ?? "" },
      ]);
      localStorage.setItem(
        "articles",
        JSON.stringify([...AllArticles, { url, summary: data?.summary ?? "" }])
      );
      setArticle(res?.data?.summary ?? "");
    } catch (err: any) {
      console.log("error occured while fetching: ", err);
      toast.error(err.message + "Request Failed, While Fetching By Given URL");
    }
  }

  async function getArticleSummaryByGivenPara(
    paragraph: string,
    lang: string,
    length: number
  ) {
    try {
      const { data }: any = await getArticleSummaryOfGivenParagraph({
        lang,
        text: paragraph,
        length,
      });
      setArticle(data.summary ?? "");

      console.log(data, "post");
    } catch (err: any) {
      console.log(err?.message);
      toast.error(
        err?.message + " Request Failed, While Fetching By Given Paragraph"
      );
    }
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const url = formData.get("url")?.toString();
    const paragraph = formData.get("paragraph")?.toString();
    const lang = formData.get("lang")?.toString();
    const length = Number(formData.get("length"));
    console.log(url, paragraph, lang, length);

    if (Service === "summarize" && url !== "") {
      await getArticleSummaryByURL(url as string, length);
    } else if (Service === "summarize-text" && paragraph !== "") {
      await getArticleSummaryByGivenPara(
        paragraph as string,
        lang as string,
        length
      );
    }
  };
  useEffect(() => {
    if (localStorage.getItem("articles")) {
      const articles = getLocalStorage("articles");
      setAllArticles([...articles]);
      if (articles.length > 0) setArticle(articles.at(0).summary);
    }
  }, []);
  const handleSpeak = () => {
    toast.success("Started Text To Speech");
    const speech = new SpeechSynthesisUtterance();
    speech.text = Article;
    speechSynthesis.speak(speech);
  };
  const handleCancelSpeech = () => {
    toast.success("Stopped Text To Speech");
    speechSynthesis.cancel();
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <section className=" px-3 pt-8 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r mt-16 mb-8 from-red-400 via-blue-500 to-green-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-6xl">
            Modify Your Text On Your Own!
            <span className="sm:block"> </span>
          </h1>
          <p className="bg-gradient-to-r mt-8 mb-12 from-gray-500 via-gray-900 to-gray-700   bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            With Open AI Model GPT - 4<span className="sm:block"> </span>
          </p>
        </div>
        <div className="flex gap-3 bg-gray-50 justify-center  p-2">
          {Object.keys(ServicesWithHeading).map((service, idx) => (
            <div
              key={idx}
              onClick={() => setService(service as Services)}
              className={`transition-all hover:opacity-90   min-h-[5rem] ${
                !(service === Service)
                  ? "bg-gradient-to-tr shadow-md"
                  : "bg-purple-100 shadow-lg"
              } px-3 py-1 rounded-lg cursor-pointer`}
            >
              <span className=" text-gray-600 text-lg font-bold  ">
                {ServicesWithHeading[service as Services]}
              </span>

              <p className="text-sm text-gray-500"> Lorem ipsum dolor sit..</p>
            </div>
          ))}
        </div>

        <div
          className={`${
            Service === "extract" &&
            "opacity-40  pointer-events-none cursor-not-allowed"
          } container mx-auto `}
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-white my-8 rounded-md shadow-lg ">
              <div className="flex justify-between items-center cursor-text px-3 py-1 gap-4">
                {Service === "summarize" && (
                  <>
                    <URLIcon />
                    <input
                      type="url"
                      name="url"
                      className="  border-none outline-none w-full"
                      placeholder="Enter URL To Summarize"
                    />
                  </>
                )}
                {Service === "summarize-text" && (
                  <>
                    <PencilIcon className="self-start h-6 w-6" />
                    <textarea
                      name="paragraph"
                      className="border-none outline-none w-full"
                      placeholder="Enter Paragraph For The Summary"
                    ></textarea>
                  </>
                )}{" "}
                <button
                  type="submit"
                  className="bg-black py-1.5 self-end px-2 rounded-md w-40 text-gray-200 hover:text-gray-300"
                  disabled={isLoading}
                >
                  {isLoading || isFetching || isPosting ? (
                    <>
                      <span className="flex justify-center items-center gap-1 ">
                        <img src="/loading.gif" className="w-7 h-7" />
                      </span>
                    </>
                  ) : (
                    <span>Generate</span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex  items-center gap-4">
              <div className="flex justify-between items-center gap-8">
                <div className="flex flex-col">
                  <label
                    htmlFor="length"
                    className="text-gray-700 font-medium mb-1"
                  >
                    Length Of The Paragraph
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    id="length"
                    name="length"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500 transition duration-300"
                    placeholder="Enter a number"
                  />
                </div>
                {Service === "summarize-text" ? (
                  <div className="flex flex-col">
                    <label
                      htmlFor="numberInput"
                      className="text-gray-700 font-medium mb-1 "
                    >
                      Language Of The Paragraph
                    </label>
                    <select name="lang" className="p-2.5 hover:opacity-75 ">
                      <option value={"en"}>English</option>
                      <option value={"ur"}>Urdu</option>
                      <option value={"sp"}>Spanish</option>
                    </select>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </form>
          <div className=" ">
            <div className="overflow-y-scroll max-h-[14.5rem] p-3">
              {AllArticles &&
                AllArticles?.map(({ url, summary }: Article, idx) => {
                  return (
                    <div
                      key={idx}
                      className="bg-white flex gap-2 items-center my-1.5 py-3 px-6 shadow-sm cursor-pointer hover:opacity-80 transition-all text-gray-500"
                    >
                      <URLIcon2 />

                      <span
                        onClick={() => {
                          setArticle(summary ?? "");
                        }}
                      >
                        {url.length > 50 ? url.slice(0, 50) + "..." : url}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          toast.success("Copied To Clipboard the URL");
                        }}
                        className="text-gray-600 ml-auto"
                      >
                        <CopyToClipBoardIcon
                          className={"w-4 hover:text-gray-800 h-4"}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          const newArticles = AllArticles.filter(
                            (article: Article) => article.url !== url
                          );

                          localStorage.setItem(
                            "articles",
                            JSON.stringify([...newArticles])
                          );
                          setAllArticles([...newArticles]);
                        }}
                      >
                        <CrossIcon />
                      </button>
                    </div>
                  );
                })}
            </div>
            {
              <>
                <div className="flex justify-between mt-16 mb-6 items-center">
                  <h2 className="bg-gradient-to-r from-red-400 via-blue-500 to-green-600 bg-clip-text text-2xl font-bold   text-transparent sm:text-3xl">
                    Article Summary:
                  </h2>
                  {Article && (
                    <div>
                      <button
                        onClick={() => {
                          toast.success("Copied To Clipboard the article");
                          navigator.clipboard.writeText(Article);
                        }}
                        className="mr-4 text-gray-700 hover:text-gray-500"
                      >
                        <CopyToClipBoardIcon className={"w-6 h-6"} />
                      </button>
                      <span className="" onClick={() => setSpeaking(!Speaking)}>
                        {Speaking ? (
                          <button onClick={handleCancelSpeech} className="">
                            <PauseIcon />
                          </button>
                        ) : (
                          <button onClick={handleSpeak}>
                            <PlayIcon />
                          </button>
                        )}
                      </span>
                    </div>
                  )}
                </div>
                <ArticleText
                  loadingArticle={isFetching || isPosting || isLoading}
                  Article={Article}
                />
              </>
            }
          </div>{" "}
        </div>
      </section>
    </>
  );
}
function ArticleText({ ...props }) {
  return (
    <p className="text-lg bg-gradient-to-r bg-clip-text text-transparent from-gray-500 via-gray-800 to-gray-600">
      {props.loadingArticle ? <ArticleSkeleton /> : props.Article}
    </p>
  );
}

function ArticleSkeleton() {
  return (
    <>
      <Skeleton count={4} baseColor="#00000017" />
      <Skeleton baseColor={"#00000017"} width={"14rem"} count={1} />
    </>
  );
}

function URLIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.2}
      stroke="currentColor"
      className="w-6 text-gray-700 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
      />
    </svg>
  );
}
function URLIcon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
}
function CopyToClipBoardIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 hover:text-red-600 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
function PencilIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.2}
      stroke="currentColor"
      className="w-6 h-6 hover:opacity-80"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
      />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-6 h-6 hover:opacity-80"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
