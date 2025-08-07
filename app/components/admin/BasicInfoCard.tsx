import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import Image from "next/image";
import FolderExplorerSingle from "./FolderExplorerSingle";

interface BasicInfoCardProps {
  data: {
    title: string;
    description: string;
    hero_image: string;
  };
  editing: boolean;
  setData: (data: any) => void;
}

export default function BasicInfoCard({
  data,
  editing,
  setData,
}: BasicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Configure the main content and hero section of the page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="page-title">Page Title</Label>
            {editing ? (
              <Input
                id="page-title"
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            ) : (
              <p className="text-sm font-medium">{data.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Hero Image</Label>
            {editing ? (
              <FolderExplorerSingle
                image={data.hero_image}
                onImageChange={(url) => setData({ ...data, hero_image: url })}
                label="Hero Image"
              />
            ) : (
              <div>
                {data.hero_image ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={data.hero_image}
                      alt="Hero image"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No image uploaded
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          {editing ? (
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              rows={3}
            />
          ) : (
            <p className="text-sm">{data.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
