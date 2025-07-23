"use client"
import { generateQuiz } from '@/actions/quiz'
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useFetch from '@/customHooks/useFetch'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface questionType {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string
}
const InterviewPage = () => {

    const [questions, setQuestions] = useState<questionType[] | null>(null);
    const [answers, setAnswers] = useState<string[]>(() => {
        const stored = localStorage.getItem("quiz_answers");
        return stored ? JSON.parse(stored) : Array(10).fill(null)
    })

    const {
        data: quizData,
        fn: quizFn,
        loading: quizLoading
    } = useFetch(generateQuiz);

// persisting selected questions and selected answers accross reloads, via localstorage
// fetching them again when the page mounts
    useEffect(() => {
        if (quizData && !quizLoading) {
            setQuestions(quizData);
            // setting up question to local storage
            localStorage.setItem("quiz_questions", JSON.stringify(quizData));
        }
    }, [quizData, quizLoading])

    useEffect(() => {
        if(answers) localStorage.setItem("quiz_answers", JSON.stringify(answers));
    }, [answers])

    // refetching last saved questions and respective answers on reload
    useEffect(() => {
        const storedQuestions = localStorage.getItem("quiz_questions");
        const storedAnswers = localStorage.getItem("quiz_answers");

        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        }

        if (storedAnswers) {
            setAnswers(JSON.parse(storedAnswers));
        }
    }, []);


    async function handleAnswerClick(quesNum:number, selectedOption:string) {
        setAnswers( prev => {
            const updated = [...prev];
            updated[quesNum] = selectedOption;
            return updated;
        })
    }

    function handleQuizSubmit(){
        console.log(answers);
        localStorage.removeItem("quiz_questions");
        localStorage.removeItem("quiz_answers");
        setQuestions(null);
        setAnswers(Array(10).fill(null));
    }

    return (
        <div className='w-[80%] min-h-screen mx-auto pt-10'>

            <h2 className='text-xl font-black sm:text-2xl lg:text-3xl'>Mock Interview</h2>
            <p className='font-semibold text-muted-foreground mb-5'>Take a industry specific, personalized skill assessment test to ace you real interviews.</p>

            {questions && !quizLoading

                ? <div className='border border-gray-700 rounded p-6 space-y-6'>
                    {questions.map((ques, qIdx) => <div key={qIdx} className='bg-zinc-900 p-2 rounded text-gray-300 space-y-2'>
                        <p className='font-semibold mb-3'><span className='mr-2'>Q{qIdx + 1}.</span><span>{ques.question}</span></p>
                        <RadioGroup
                        value={answers[qIdx] || ""}
                        onValueChange={(value) => handleAnswerClick(qIdx,value)}
                        >
                            {ques.options.map((option,oIdx) => 
                            <div 
                            key={oIdx} className="flex items-center gap-3">
                                <RadioGroupItem value={option} id={`${qIdx}-${oIdx}`} />
                                <Label className='font-normal' htmlFor={`${qIdx}-${oIdx}`}>{option}</Label>
                            </div>)}
                        
                        </RadioGroup>
                    </div>)}

                    <button
                    onClick={handleQuizSubmit}
                    className='bg-gray-300 text-black font-semibold hover:bg-gray-400 px-8 mt-4 py-3 rounded'>Submit Quiz</button>
                </div>


                : <div className='border border-gray-800 rounded p-8 text-center mt-5'>
                    <h3 className='text-lg text-gray-300'>10 questions relevant to your domain, with increasing difficulty. <br />Attempt all to be better assessed and get most accurate improvement tips.</h3>

                    <button
                        disabled={quizLoading}
                        onClick={quizFn}
                        className='bg-gray-300 text-black font-semibold hover:bg-gray-400 px-8 mt-4 py-3 rounded'>
                        {quizLoading ? <ClipLoader size={"18px"} color='black' /> : "Start Assessment"}
                    </button>
                    {quizLoading && <p className='mt-1'>Generating best questions...</p>}
                </div>}
        </div>
    )
}

export default InterviewPage