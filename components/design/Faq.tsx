"use client"
import { IDesign, IService } from '@/interfaces'
import React, { useRef, useState } from 'react'
import { H1, H2, P } from '../ui'

interface Props {
    content: IDesign
    services: IService[]
    index: number
    step?: string
}

export const Faq: React.FC<Props> = ({ content, services, index, step }) => {
  const [question, setQuestion] = useState(-1);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggleQuestion = (i: number) => {
    setQuestion(question === i ? -1 : i);
  };

  const getMaxHeight = (i: number): string => {
    if (contentRefs.current[i]) {
      return question === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px";
    }
    return "0px";
  };

  return (
    <div
      className="flex flex-col gap-8 px-4 py-8 m-auto w-full max-w-[1280px]"
      style={{
        background: `${
          content.info.typeBackground === "Degradado"
            ? content.info.background
            : content.info.typeBackground === "Color"
            ? content.info.background
            : ""
        }`,
      }}
    >
      {content.info.title && content.info.title !== "" || content.info.description && content.info.description !== "" ? (
        <div className="flex flex-col gap-4">
          {content.info.title && content.info.title !== "" ? (
            index === 0 ? (
              <H1 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
            ) : (
              <H2 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
            )
          ) : (
            ""
          )}
          {content.info.description && content.info.description !== "" ? (
            <P config="text-center" text={content.info.description} />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      <div className='flex flex-col gap-6'>
        {content.info.faq?.map((faq, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 p-6 rounded-xl border border-black/5 transition-transform duration-300"
            style={{ boxShadow: "0px 3px 10px 3px #11111108" }}
          >
            <div
              className="flex gap-6 justify-between cursor-pointer"
              onClick={(e: any) => {
                e.preventDefault();
                toggleQuestion(i);
              }}
            >
              <p className="font-medium text-lg">{faq.question}</p>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className={`my-auto text-2xl transition-transform duration-300 ${
                  question === i ? "rotate-180" : ""
                }`}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"></path>
              </svg>
            </div>
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className={`overflow-hidden transition-all duration-300`}
              style={{ maxHeight: getMaxHeight(i) }}
            >
              <p className="mt-2">{faq.response}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};