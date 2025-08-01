"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import { Download } from 'lucide-react';

interface ResumeType {
    id: string;
    userId: string;
    content: string;
    atsScore: number | null;
    feedback: string | null;
    createdAt: Date;
    updatedAt: Date
}

const ResumeBuilder = ({ initialContent }: { initialContent: ResumeType | null }) => {

    const [tab, setTab] = useState("");

    return (
        <div>

            <h2 className='text-2xl lg:text-3xl text-gray-200 font-extrabold mb-2'>Resume Builder</h2>

            <Tabs defaultValue="account">
                <div className='flex justify-between items-center w-full'>
                    <TabsList>
                    <TabsTrigger onClick={() => setTab("form")} value="form">form</TabsTrigger>
                    <TabsTrigger onClick={() => setTab("preview")} value="preview">preview</TabsTrigger>
                </TabsList>
                {tab==="preview" && <button className='bg-gray-300 flex gap-2 items-center text-black py-1 px-4 rounded'><Download size={"16px"} color='black'/><span className='hidden sm:block'>Download pdf</span></button>}
                </div>
                <TabsContent value="form">
                    <ResumeForm />
                </TabsContent>
                <TabsContent value="preview">
                    <ResumePreview />
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default ResumeBuilder