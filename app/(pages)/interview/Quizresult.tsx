"use client"
import React, { useState } from 'react'
import { assessmentType } from './page'
import { ArrowLeft, Check, CircleX } from 'lucide-react';
import { BarLoader } from 'react-spinners';

const Quizresult = ({ result, setResult }: 
    { result: assessmentType, 
      setResult: React.Dispatch<React.SetStateAction<assessmentType | undefined>>}) => {

    console.log(result);
    const [loading, setLoading] = useState<boolean>(false);


    async function handleRetake() {
        setLoading(true);
        await new Promise(res => setTimeout(res, 2000));
        setLoading(false);
        setResult(undefined);
    }

    return (
        <div className=" min-h-screen text-neutral-300 p-6 font-sans flex items-center justify-center">

            <div className="relative rounded-2xl shadow-xl p-6 sm:p-10 min-w-full max-w-5xl border border-neutral-800">

                {loading && <div className='absolute top-0 left-0 min-w-full'><BarLoader width={"100%"} color='white'/></div>}

                <button 
                onClick={handleRetake}
                className='text-gray-300 flex items-center gap-2 hover:bg-gray-800 duration-200 w-fit py-1 cursor-pointer px-4 rounded-lg'><ArrowLeft size={"15px"}/> Back</button>
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-800">
                    
                    <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-50 tracking-tight">
                        Assessment Result
                    </h2>
                    
                </div>

                <div className="mb-10">
                    <h3 className="text-xl sm:text-xl font-bold text-gray-300 mb-4">Quiz score<span className='text-3xl text-white ml-4 font-bold ml-2'>{result.quizScore} <span className='text-xl text-gray-300'>/ 10</span></span></h3>
                    {result.improvementTip && <div className="bg-neutral-800 p-5 rounded-lg border-l-4 border-neutral-700">
                        <h2 className='text-lg font-black'>Improvement Tip</h2>
                        <p className="leading-relaxed text-neutral-400">
                            {result.improvementTip}
                        </p>
                    </div>}
                </div>

                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-300 mb-6">Questions attempted</h2>
                    <ul className="space-y-8">
                        {result.questions.map((ques, idx) => (
                            <li key={idx} className="bg-gray-950 p-4 rounded-lg border-l-4 border-neutral-700 shadow-md">
                                <h2 className="sm:text-xl mb-3 text-neutral-50">{ques.question}</h2>
                                {!ques.isCorrect && ques.userAnswer ? (
                                    <div className="space-y-2">
                                        <p className="flex items-center text-red-500">
                                            <span className="mr-3 text-red-500">
                                                <CircleX size="20px" />
                                            </span>
                                            {ques.userAnswer}
                                        </p>
                                        <p className="flex items-center text-green-500">
                                            <span className="mr-3 text-green-500">
                                                <Check size="20px" />
                                            </span>
                                            {ques.answer}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="flex items-center text-green-500">
                                        <span className="mr-3 text-green-500">
                                            <Check size="20px" />
                                        </span>
                                        {ques.answer}
                                    </p>
                                )}
                                <p className='font-semibold mt-4'>Explanation</p>
                                <p className='text-gray-400'>{ques.explanation}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Quizresult