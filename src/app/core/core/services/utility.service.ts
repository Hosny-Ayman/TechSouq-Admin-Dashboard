import { Injectable } from '@angular/core';
import { ImageInfo } from '../../interfaces/IImageInfo';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    getImageUrl(ImageInfo: ImageInfo): string {
        if (!ImageInfo.imagePath) return 'https://placehold.co/150x150/292929/FFF?text=No+Image';
        if (ImageInfo.imagePath.startsWith('http')) return ImageInfo.imagePath;
        const fileName = ImageInfo.imagePath.split('/').pop();
        return 'https://localhost:7180/' + ImageInfo.imageFile + '/' + fileName;
    }
}
