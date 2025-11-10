import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { services, galleryImages } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const featuredServices = services.slice(0, 3);
  const featuredImages = galleryImages.slice(0, 4);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover object-center brightness-50"
            priority
          />
        )}
        <div className="relative container px-4 md:px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-headline font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
              Elegance in Every Detail
            </h1>
            <p className="mt-4 text-lg text-gray-200 md:text-xl">
              Welcome to Blak Whyte Studio, where luxury meets artistry. Discover our exclusive services and book your experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/book">
                  Book Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                <Link href="/services">
                  Our Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">Featured Services</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
              Experience the best of what we offer with our most popular services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => {
              const serviceImage = PlaceHolderImages.find(img => img.id === service.imageId);
              return (
                <Card key={service.id} className="overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative h-64 w-full">
                       {serviceImage && (
                        <Image
                          src={serviceImage.imageUrl}
                          alt={service.name}
                          data-ai-hint={serviceImage.imageHint}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-headline font-semibold text-foreground">{service.name}</h3>
                      <p className="mt-2 text-muted-foreground line-clamp-2">{service.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-lg font-semibold text-primary">${service.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{service.duration} mins</p>
                      </div>
                      <Button asChild className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/book">Book Service</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">Our Gallery</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
              A glimpse into the transformations and artistry at Blak Whyte Studio.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredImages.map((image, index) => {
              const galleryImage = PlaceHolderImages.find(img => img.id === image.id);
              return (
                <div key={image.id} className={cn("overflow-hidden rounded-lg shadow-lg", index >= 2 && 'hidden md:block')}>
                   {galleryImage && (
                    <Image
                      src={galleryImage.imageUrl}
                      alt={galleryImage.description}
                      data-ai-hint={galleryImage.imageHint}
                      width={400}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/gallery">
                View Full Gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
