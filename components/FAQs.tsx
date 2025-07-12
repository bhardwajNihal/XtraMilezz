
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const FAQs = () => {

    const faqs = [
        {
            question: "What sets XtraMilezz apart as a career growth platform?",
            answer:
                "XtraMilezz merges the power of AI with deep industry intelligence to provide a truly personalized career experience. From a smart resume builder and AI-generated cover letters to adaptive mock interviews—each feature is crafted around your unique background and industry, helping you move forward with confidence.",
        },
        {
            question: "How does XtraMilezz personalize content for me?",
            answer:
                "During onboarding, XtraMilezz gathers insights about your industry, experience level, and skill set. This data fuels our AI to tailor resumes, cover letters, and interview questions specifically to your profile—ensuring every output aligns with current industry standards and your career trajectory.",
        },
        {
            question: "How reliable are XtraMilezz’s industry insights?",
            answer:
                "Our industry insights are updated weekly through AI-driven analysis of market trends. From salary benchmarks and emerging tools to growth forecasts and in-demand skills—XtraMilezz ensures you're equipped with the latest data to make informed career decisions.",
        },
        {
            question: "How secure is my information on XtraMilezz?",
            answer:
                "Your data security is our top priority. All personal and professional data is encrypted and stored securely following best industry practices. Authentication is managed via NextAuth and your information is never shared without your explicit consent.",
        },
        {
            question: "Can I monitor my interview prep progress?",
            answer:
                "Absolutely. XtraMilezz provides real-time analytics after each mock interview—highlighting your strengths, tracking your improvement, and offering AI-backed suggestions for refinement. This way, you can see measurable progress and prepare more effectively.",
        },
        {
            question: "Am I able to customize the AI-generated content?",
            answer:
                "Yes. XtraMilezz gives you complete flexibility. All resumes, cover letters, and content are fully editable using our intuitive markdown editor, allowing you to personalize and perfect every detail to fit your goals.",
        },
    ];


    return (
        <div className='w-[60%] mx-auto'>
            {faqs.map(ques => <Accordion key={ques.question} type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className='mb-1'>{ques.question}</AccordionTrigger>
                    <AccordionContent className='border-b border-gray-800'>
                        {ques.answer}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>)}
        </div>
    )
}

export default FAQs