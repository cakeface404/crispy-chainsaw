import Image from "next/image";
import { products } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ProductsPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
              Our Products
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
              Take a piece of luxury home with you. High-quality products curated by our experts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
              const productImage = PlaceHolderImages.find(img => img.id === product.imageId);
              return (
                <Card key={product.id} className="flex flex-col group overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  {productImage && (
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={productImage.imageUrl}
                        alt={product.name}
                        data-ai-hint={productImage.imageHint}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="line-clamp-3">{product.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="font-bold text-lg text-primary">${product.price.toFixed(2)}</p>
                    <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Add to Cart</span>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
