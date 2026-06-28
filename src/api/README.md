This is an example file showcasing style for files in /api folder using @tanstack/react-query library

It consists of using ES6, types declaration and passing values for readability

```
import axios from "../axiosConfig";
import { type AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export type TCallAttemptResponse = {
  id: string;
  contact_id?: string | null;
  question_set_id?: string | null;
  contact_label?: string | null;
  to_number?: string | null;
  conversation_id?: string | null;
  success?: boolean | null;
  status_message?: string | null;
  created_at: string;
};

export type TCreateCallRequest = {
  contact_id?: string | null;
  to_number?: string | null;
};

export const createCall = async (
  payload: TCreateCallRequest,
): Promise<TCallAttemptResponse> => {
  const { data }: AxiosResponse = await axios.post("/calls", payload);

  return data;
};

export const useCreateCall = (
  onSuccess?: (data: TCallAttemptResponse) => void,
  onError?: (err: unknown) => void,
) => {
  return useMutation({
    mutationFn: (args: { payload: TCreateCallRequest }) =>
      createCall(args.payload),
    onSuccess,
    onError,
  });
};

export const getAllCalls = async (): Promise<TCallAttemptResponse[]> => {
  const { data }: AxiosResponse = await axios.get("/calls");

  return data;
};

export const useGetAllCalls = (
  onSuccess?: (data: TCallAttemptResponse[]) => void,
  onError?: (err: unknown) => void,
) => {
  return useQuery({
    queryKey: ["getAllCalls"],
    queryFn: () => getAllCalls(),
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    meta: {
      onSuccess,
      onError,
    },
  });
};
```
