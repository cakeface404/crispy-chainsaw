import Image from 'next/image';
import { galleryImages } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function GalleryPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
          Our Work
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Witness the artistry and transformations we create every day.
        p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {galleryImages.map(image => {
          const galleryImage = PlaceHolderImages.find(img => img.id === image.imageId);
          return galleryImage ? (
            <div key={image.id} className="overflow-hidden rounded-lg shadow-lg break-inside-avoid">
              <Image
                src={galleryImage.imageUrl}
                alt={galleryImage.description}
                data-ai-hint={galleryImage.imageHint}
                width={500}
                height={Math.floor(Math.random() * (600 - 400 + 1)) + 400}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
