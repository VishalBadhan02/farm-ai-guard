import api from '@/api/axios';
import endpoints from '@/api/endpoints';
import { Media } from '@/types';
export const MediaService = {

    async generateUrl(credentials: Media) {
        const response = await api.post<{ image: FormData }>(
            endpoints.media.url,
            credentials
        );
        return response.data;
    }

}