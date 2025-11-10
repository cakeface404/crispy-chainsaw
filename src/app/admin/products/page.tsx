import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function ProductsAdminPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Manage Products</h2>
      <p className="text-muted-foreground mb-6">
        Manage the inventory of products sold at the studio.
      </p>
       <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The product management interface is under development. Soon you'll be able to add new products, track inventory, and manage pricing right from this dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
