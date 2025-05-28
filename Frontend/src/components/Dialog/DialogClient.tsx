'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import LandingCarousel from '@/components/LandingCarousel/LandingCarousel';
import QuestionBox from '../QuestionBox/QuestionBox';
import TypingDialog from '../TypingDialog/TypingDialog';
import LoadingTruck from '../LoadingTruck/LoadingTruck';

interface DialogClientProps {
    arrayOfYears: number[];
    totalRecords: { total: number, vehicles: number, accidents: number };
  }

export const DialogClient: FC<DialogClientProps> = ({ arrayOfYears, totalRecords }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <div className="w-fit h-240 flex flex-row items-center justify-center gap-6 presentation-mobile-div">
        {/* Left Column */}
        <div className="flex flex-col h-full max-h-230 min-h-230 max-w-[412px] shadow-lg bg-white p-6 gap-6 rounded-xl presentation-desktop">
          <div>
            <h2 className="text-xl font-semibold">Presenter</h2>
            <div className="relative w-[364px] h-[263px]">
              <Image src="/images/presenter.webp" 
              alt="Presenter" 
              width={364}
              height={236} 
              />
              <div className="mouth" />
            </div>
            <div className="h-[1px] mt-2" />
          </div>
          <TypingDialog currentSlide={currentSlide} totalRecords={totalRecords} />
        </div>

        {/* Carousel and content */}
        <div className="flex flex-col max-h-230 min-h-230 justify-between max-w-3xl presentation-desktop">
          <div className="flex flex-1 bg-white p-8 rounded-t-xl shadow-lg overflow-hidden">
            <LandingCarousel setCurrentSlide={setCurrentSlide} arrayOfYears={arrayOfYears}/>
          </div>
          <QuestionBox currentSlide={currentSlide}/>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-[300px] max-h-230 min-h-230 justify-center gap-6 cards">
          <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Did you know? 🏁</h2>
              <p className="text-sm text-gray-700 mt-6">
              California, Texas and Florida are the states with most car accidents in the United States?
              </p>
          </div >
          <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Did you know? 🚗</h2>
              <p className="text-sm text-gray-700">
              Ford, Chevrolet and Toyota are the vehicles with most accidents in the United States?
              </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Did you know? 😲</h2>
              <p className="text-sm text-gray-700">
              Every year on new year theres are a total of 397 fatal accidents just in the USA?
              </p>
          </div>
          <div className="flex-1 relative max-h-90 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">Grab you popcorn 🍿🎬</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
              {"Grab your popcorn and enjoy the presentation\n\nEverything's better with popcorn 😋"}
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
              {"\nAlso, enjoy the beautiful Loader that i mannualy created:"}
              </p>
              <LoadingTruck embedded />
          </div>
        </div>
      </div>
      {/* Carousel and content Mobile */}
      <div className="flex flex-col h-350 max-w-3xl presentation-mobile">
        <div className="flex h-150 bg-white p-8 rounded-t-xl shadow-lg">
          <LandingCarousel setCurrentSlide={setCurrentSlide} arrayOfYears={arrayOfYears}/>
        </div>
        <div className="flex flex-row h-90 shadow-lg bg-white p-6 gap-6">
          <div>
            <h2 className="text-xl font-semibold">Presenter</h2>
            <div className="relative w-[364px] h-[263px]">
              <Image src="/images/presenter.png" alt="Presenter" fill />
              <div className="mouth" />
            </div>
            <div className="h-[1px] mt-2" />
          </div>
          <TypingDialog currentSlide={currentSlide} totalRecords={totalRecords} />
        </div>
        <QuestionBox currentSlide={currentSlide}/>
      </div>
    </>
  );
}
