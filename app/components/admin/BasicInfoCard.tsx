import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";
import FolderExplorerSingle from "./FolderExplorerSingle";
import I18nTextField, { type I18nValue } from "./i18n/I18nTextField";
import I18nTextarea from "./i18n/I18nTextarea";
import { resolveI18n } from "@/app/lib/i18n/resolve";
import { defaultLocale } from "@/app/lib/i18n/config";

interface BasicInfoCardProps {
  data: {
    title: unknown;
    description: unknown;
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
  const titlePreview = resolveI18n(data.title as any, defaultLocale);
  const descPreview = resolveI18n(data.description as any, defaultLocale);

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
            {editing ? (
              <I18nTextField
                label="Page Title"
                value={data.title}
                onChange={(v: I18nValue) => setData({ ...data, title: v })}
              />
            ) : (
              <>
                <Label>Page Title</Label>
                <p className="text-sm font-medium">{titlePreview}</p>
              </>
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
          {editing ? (
            <I18nTextarea
              label="Description"
              value={data.description}
              onChange={(v: I18nValue) => setData({ ...data, description: v })}
              rows={3}
            />
          ) : (
            <>
              <Label>Description</Label>
              <p className="text-sm">{descPreview}</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
