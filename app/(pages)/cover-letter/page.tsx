"use client"
import { generateCoverLetter } from '@/actions/coverLetter'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { toast } from 'sonner'

const CoverLetter = () => {

  const router = useRouter()
  const { status } = useSession();  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  const [role, setRole] = useState<string | undefined>();
  const [organization, setOrganization] = useState<string | undefined>();
  const [coverLetter, setCoverLetter] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleGenerateCoverLetter() {

    if (!role || !organization) {
      toast.error("Role and organization are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await generateCoverLetter({ role, organization });
      setCoverLetter(res);
    } catch (error) {
      console.error(error);
      toast.error("Error generating cover letter.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='pt-8 w-full px-10 sm:px-16 lg:px-32 space-y-2'>
      <h2 className='text-xl sm:text-3xl font-bold'>Cover letter</h2>

      <Label htmlFor='role' className='text-xl font-semibold'>Role</Label>
      <Input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        id='role' type="text" placeholder='Role you are applying for (e.g. Data Analyst, content writer, etc. . .)' />

      <Label htmlFor='organization' className='text-xl font-semibold'>Organization</Label>
      <Input
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        id='organization' type="text" placeholder='Organization you are applying to. . .' />

      <div className='flex items-end justify-between'>
        <button
          onClick={handleGenerateCoverLetter}
          className='bg-gray-300 text-black font-semibold hover:bg-gray-400 px-8 mt-4 py-3 rounded'>
          {loading ? <span><ClipLoader size={"16px"} color="black" /> Generating...</span> : "Generate"}
        </button>

        {coverLetter && <div 
        onClick={() => {
          if(!coverLetter) return;
          navigator.clipboard.writeText(coverLetter);
          toast.success("Copied to clipboard!")
        }}
        className='py-1 px-4 rounded border border-gray-500 flex items-center gap-1 cursor-pointer hover:bg-gray-900'>
          <Copy size={"15px"} color='white' />
          <span className='hidden sm:block'>Copy</span>
        </div>}
      </div>

      {coverLetter
        ? <div className='border border-gray-600 rounded-lg p-6 mt-4 mb-8'>{coverLetter}</div>
        : <p className='text-lg text-gray-600 mt-8 text-center'>Generated content will appear here.</p>
      }

    </div>
  )
}

export default CoverLetter