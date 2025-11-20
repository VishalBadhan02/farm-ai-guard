import { useFetchMutation } from "@/hooks/react-query/useFetchMutation";
import { useMediaService } from "@/services/mediaService";

export const useMediaUploadtMutation = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
) => {
    const { postMessage } = useMediaService();

    return useFetchMutation({
        mutationFn: (formData: any) => postMessage(formData),
        onSuccess,
        onError,
    });
};
export const useGenerateUrlMutation = (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
) => {
    const { generateURL } = useMediaService();

    return useFetchMutation({
        mutationFn: (formData: any) => generateURL(formData),
        onSuccess,
        onError,
    });
};
