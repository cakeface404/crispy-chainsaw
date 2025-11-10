import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function ServicesAdminPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Manage Services</h2>
      <p className="text-muted-foreground mb-6">
        Add, edit, or remove services offered by the studio.
      </p>
       <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The interface for managing your studio's services is currently under construction. You'll soon be able to add new services, update pricing, and more, all from this dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
