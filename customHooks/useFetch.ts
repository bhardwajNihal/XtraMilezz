import { useState } from "react";
import { toast } from "sonner";


function useFetch<TArgs, TReturn>( cb: (args: TArgs) => Promise<TReturn>) {
//   type ResponseData = Awaited<ReturnType<T>>;

  const [data, setData] = useState<TReturn | null>(null);
  const [loading, setLoading] = useState<boolean | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const fn = async (args : TArgs) => {
    setLoading(true);   
    setError(null);

    try {
      const response = await cb(args);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      toast.error(error.message || "Something went wrong");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}

export default useFetch;
