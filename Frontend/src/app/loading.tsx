'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div 
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-center pr-[50px] mb-[-30px]">
          {/* Boxes */}
          <div className="flex flex-col items-end justify-end mr-[-3px]">
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut', delay: 0.3 }}
            >
              <div className="relative w-[38px] h-[33px] bg-[#D8A26B] border-[3px] border-black flex items-start justify-center mb-[-3px]">
                <div className="w-[8px] h-[13px] bg-[#E97658]" />
              </div>
            </motion.div>
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut', delay: 0 }}
            >
              <div className="relative w-[48px] h-[31px] bg-[#D8A26B] border-[3px] border-black flex items-start justify-center">
                <div className="w-[12px] h-[9px] bg-[#315B7B]" />
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col items-start justify-end">
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut', delay: 0.2 }}
            >
              <div className="relative w-[24px] h-[42px] bg-[#D8A26B] border-[3px] border-black flex items-start justify-center mb-[-3px]">
                <div className="w-[4px] h-[14px] bg-[#315B7B]" />
              </div>
            </motion.div>
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut', delay: 0.1 }}
            >
              <div className="relative w-[36px] h-[31px] bg-[#D8A26B] border-[3px] border-black flex items-start justify-center">
                <div className="w-[8px] h-[9px] bg-[#E97658]" />
              </div>
            </motion.div>
          </div>
        </div>
        {/* Cabin */}
        <motion.div
          className="relative"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <div className="flex items-end">
            <div className="flex flex-col items-end w-[92px] h-[45px]">
              <div className="flex-1 w-[92px] h-[15px] bg-[#1590EF] border-t-[3px] border-l-[3px] border-b-[3px] border-black rounded-bl-[4px]" />
              <div className="relative w-[88px] h-[31px] bg-[#1590EF] rounded-bl-[6px] border-l-[3px] border-b-[3px] border-black">
                <div className="absolute w-[12px] h-[15px] left-0 top-1/2 -translate-y-1/2 bg-[#D8A26B] border-t-[3px] border-r-[3px] border-b-[3px] border-black rounded-tr-[4px] rounded-br-[4px]" />
              </div>
            </div>

            <div className="relative w-[53px] h-[65px] border-[3px] bg-[#1590EF] border-black rounded-tr-[14px] flex items-end justify-center">
              <div className="relative w-[34px] h-[52px] bg-white  border-t-[3px] border-l-[3px] border-r-[3px] border-black rounded-tr-[14px] flex items-end">
                <div className="w-full h-[30px] bg-[#1590EF] border-t-[3px] border-black" />
              </div>
            </div>

            <div className="relative w-[11px] h-[41px] bg-[#1590EF] border-t-[3px] border-r-[3px] border-b-[3px] border-black rounded-tr-[6px] rounded-br-[6px] flex flex-col items-center">
              <div className="w-full h-[16px] bg-[#D8A26B] border-t-[3px] border-b-[3px] border-black mt-[7px]" />
            </div>
          </div>
        </motion.div>
        <div className="flex flex-row justify-between w-full pl-[24px] pr-[15px] mt-[-23px] z-10">
          {/* Wheels */}
          <div className="w-[34px] h-[34px] rounded-full border-[3px] border-black bg-[#969EA9] flex items-center justify-center">
            <div className="w-[28px] h-[28px] relative flex items-center justify-center animate-spin-slow">
              <div className="absolute top-0 right-0 w-full h-full border-t border-r border-black border-[3px] opacity-20 rounded-full animate-spin-slow" />
              <div className="w-[14px] h-[14px] border-[3px] border-black rounded-full" />
            </div>
          </div>

          <div className="w-[34px] h-[34px] rounded-full border-[3px] border-black bg-[#969EA9] flex items-center justify-center">
            <div className="w-[28px] h-[28px] relative flex items-center justify-center animate-spin-slow">
              <div className="absolute top-0 right-0 w-full h-full border-t border-r border-black border-[3px] opacity-20 rounded-full animate-spin-slow" />
              <div className="w-[14px] h-[14px] border-[3px] border-black rounded-full" />
            </div>
          </div>
        </div>

        <div className="relative w-full h-[4px] flex flex-row">
          {/* Smoke */}
          <motion.div
            className="w-[10px] h-[10px] bg-gray-400 rounded-full mt-[-45px] "
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-[10px] h-[10px] bg-gray-400 rounded-full mt-[-35px] ml-[-35px]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-[10px] h-[10px] bg-gray-400 rounded-full mt-[-25px]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Road */}
          <div className="w-[170px] h-[6px] bg-gray-700 rounded-[2px]" />

          <motion.div
            className="w-[8px] h-[8px] mt-[-4px] bg-gray-700 rounded-tl-[3px] rounded-tr-[3px]"
            animate={{ x: [0, -150] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
