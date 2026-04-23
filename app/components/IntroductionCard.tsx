// components/IntroductionCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
import I18nTextField, {
  type I18nValue,
} from "./admin/i18n/I18nTextField";
import I18nTextarea from "./admin/i18n/I18nTextarea";
import { resolveI18n } from "@/app/lib/i18n/resolve";
import { defaultLocale } from "@/app/lib/i18n/config";

interface IntroductionCardProps {
  editing: boolean;
  data: {
    intro_title: unknown;
    intro_description: unknown;
  };
  setData: (data: any) => void;
}

export default function IntroductionCard({
  editing,
  data,
  setData,
}: IntroductionCardProps) {
  const titlePreview = resolveI18n(data.intro_title as any, defaultLocale);
  const descPreview = resolveI18n(data.intro_description as any, defaultLocale);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction Section</CardTitle>
        <CardDescription>
          Configure the introduction content that appears below the hero section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {editing ? (
          <I18nTextField
            label="Intro Title"
            value={data.intro_title}
            onChange={(v: I18nValue) =>
              setData({ ...data, intro_title: v })
            }
          />
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Intro Title</div>
            <p className="text-sm font-medium">{titlePreview}</p>
          </div>
        )}
        {editing ? (
          <I18nTextarea
            label="Intro Description"
            value={data.intro_description}
            onChange={(v: I18nValue) =>
              setData({ ...data, intro_description: v })
            }
            rows={4}
          />
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Intro Description</div>
            <p className="text-sm">{descPreview}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
