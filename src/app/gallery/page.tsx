"use client";

import Image from 'next/image';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { GalleryImage } from '@/lib/types';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useMemo } from 'react';

export default function GalleryPage() {
  const firestore = useFirestore();
  const galleryCollection = useMemo(() => firestore ? collection(firestore, 'gallery') : null, [firestore]);
  const { data: galleryImages, isLoading } = useCollection<GalleryImage>(galleryCollection);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
              Our Work
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
              Witness the artistry and transformations we create every day.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {galleryImages?.map(image => (
              <div key={image.id} className="overflow-hidden rounded-lg shadow-lg break-inside-avoid">
                <Image
                  src={image.imageUrl}
                  alt={image.description || 'Gallery image'}
                  data-ai-hint={image.description || 'salon work'}
                  width={500}
                  height={Math.floor(Math.random() * (600 - 400 + 1)) + 400}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
