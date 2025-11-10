import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ServicesPage() {
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
              Our Services
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
              Explore our wide range of luxury services, tailored to your needs.
            </p>
          </div>

          {categories.map((category) => (
            <section key={category} className="mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tight mb-8">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services
                  .filter((service) => service.category === category)
                  .map((service) => {
                    const serviceImage = PlaceHolderImages.find(img => img.id === service.imageId);
                    return (
                      <Card key={service.id} className="flex flex-col group overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                        {serviceImage && (
                          <div className="relative h-56 w-full overflow-hidden">
                            <Image
                              src={serviceImage.imageUrl}
                              alt={service.name}
                              data-ai-hint={serviceImage.imageHint}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="font-headline">{service.name}</CardTitle>
                          <CardDescription className="line-clamp-3 h-[60px]">{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Duration: {service.duration} mins</span>
                            <span className="font-bold text-lg text-primary">${service.price.toFixed(2)}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Link href={`/book?service=${service.id}`}>Book Now</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
