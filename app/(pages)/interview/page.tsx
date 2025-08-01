"use client"
import { assessQuiz, fetchPastAssessments, generateQuiz } from '@/actions/quiz'
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useFetch from '@/customHooks/useFetch'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';
import Quizresult from './Quizresult';
import { formatDate } from 'date-fns';

interface questionType {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string
}

interface questionType {
    answer: string;
    explanation: string;
    isCorrect: boolean;
    question: string;
    userAnswer: string
}

export interface assessmentType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    quizScore: number;
    questions: questionType[];
    category: string;
    improvementTip: string | null;
}

interface pastAssessmentsType {

    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    quizScore: number;
    category: string;
    improvementTip: string | null;
    questions: questionType[];
}

const InterviewPage = () => {

    const [questions, setQuestions] = useState<questionType[] | null>(() => {
        const stored = localStorage.getItem("quiz_questions");
        return stored ? JSON.parse(stored) : null;
    });

    const [answers, setAnswers] = useState<string[]>(() => {
        const stored = localStorage.getItem("quiz_answers");
        return stored ? JSON.parse(stored) : Array(10).fill(null)
    })
    const [result, setResult] = useState<assessmentType | undefined>(undefined);
    const [pastAssessments, setPastAssessments] = useState<pastAssessmentsType[] | undefined>();

    const {
        data: quizData,
        fn: quizFn,
        loading: quizLoading
    } = useFetch(generateQuiz);

    const {
        data: assessmentData,
        loading: assessmentLoading,
        fn: assessmentFn
    } = useFetch(assessQuiz);


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
        if (answers) localStorage.setItem("quiz_answers", JSON.stringify(answers));
    }, [answers])

    // fetching past assessments 
    useEffect(() => {
        async function getpassAssesmentts() {
            const data = await fetchPastAssessments();

            const parsedData: pastAssessmentsType[] = data.map((item) => ({
                ...item,
                questions: item.questions as unknown as questionType[],
            }));
            setPastAssessments(parsedData)
            // console.log(parsedData);

        }
        getpassAssesmentts();
    }, [])


    function handleAnswerClick(quesNum: number, selectedOption: string) {
        setAnswers(prev => {
            const updated = [...prev];
            updated[quesNum] = selectedOption;
            return updated;
        })
    }

    async function handleQuizSubmit() {
        await assessmentFn({ questions, answers });

        localStorage.removeItem("quiz_questions");
        localStorage.removeItem("quiz_answers");
        setQuestions(null);
        setAnswers(Array(10).fill(null));
    }

    useEffect(() => {
        if (assessmentData && !assessmentLoading) {
            setResult({
                ...assessmentData,
                questions: assessmentData.questions as unknown as questionType[]
            })
        }
    }, [assessmentData, assessmentLoading]);

    if (result) return <Quizresult result={result} setResult={setResult} />

    return (
        <div className='w-[80%] min-h-screen mx-auto pt-10'>

            <h2 className='text-xl font-black sm:text-2xl lg:text-3xl'>Mock Interview</h2>
            <p className='font-semibold text-muted-foreground mb-5'>Take a industry specific, personalized skill assessment test to ace you real interviews.</p>

            {questions && !quizLoading

                ? <div className='border border-gray-700 rounded p-6 space-y-6 sm:space-y-10'>
                    {questions.map((ques, qIdx) => <div key={qIdx} className='bg-zinc-900 p-4 sm:p-8 rounded text-gray-300 space-y-3'>
                        <p className='font-semibold mb-5'><span className='mr-2'>Q{qIdx + 1}.</span><span>{ques.question}</span></p>
                        <RadioGroup
                            value={answers[qIdx] || ""}
                            onValueChange={(value) => handleAnswerClick(qIdx, value)}
                        >
                            {ques.options.map((option, oIdx) =>
                                <div
                                    key={oIdx} className="flex items-center gap-3 hover:bg-black duration-200 p-2 rounded">
                                    <RadioGroupItem value={option} id={`${qIdx}-${oIdx}`} />
                                    <Label className='font-normal' htmlFor={`${qIdx}-${oIdx}`}>{option}</Label>
                                </div>)}

                        </RadioGroup>
                    </div>)}

                    <button
                        disabled={assessmentLoading}
                        onClick={handleQuizSubmit}
                        className='bg-gray-300 text-black font-semibold hover:bg-gray-400 px-8 mt-4 py-3 rounded'>{assessmentLoading ? <span><ClipLoader size={"16px"} color='black' /> Submitting...</span> : "Submit Quiz"}</button>
                </div>


                : <div className='border border-gray-800 rounded p-8 text-center mt-5'>
                    <h3 className='text-lg text-gray-300'>10 questions relevant to your domain, with increasing difficulty. <br />Attempt all to be better assessed and get most accurate improvement tips.</h3>

                    <button
                        disabled={quizLoading}
                        onClick={quizFn}
                        className='bg-gray-300 text-black font-semibold hover:bg-gray-400 px-8 mt-4 py-3 rounded'>
                        {quizLoading ? <ClipLoader size={"18px"} color='black' /> : "Start Assessment"}
                    </button>
                    {quizLoading && <p className='mt-1'>Wait a while, Generating questions...</p>}

                    <div className='mt-8'>
                        <h2 className='text-xl sm:text-2xl mb-3 font-bold text-start'>Past Assessments</h2>
                            <ul>
                                {pastAssessments?.map (data => <li onClick={() => setResult(data)} key={data.id} className='border border-gray-700 rounded px-4 py-2 text-start mb-2 hover:bg-gray-800 cursor-pointer duration-200'>
                                    <div className='font-bold text-sm text-gray-300'>Taken <span className='font-normal'>{formatDate(new Date(data.createdAt), "EEEE, Mo MMM, yyyy ")}</span></div>
                                    <span className='font-bold'>Quiz Score {data.quizScore}/10</span>
                                    
                                </li>)}
                            </ul>
                    </div>
                </div>}
        </div>
    )
}

export default InterviewPage