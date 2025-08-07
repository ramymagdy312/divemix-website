// components/IntroductionCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

interface IntroductionCardProps {
  editing: boolean;
  data: {
    intro_title: string;
    intro_description: string;
  };
  setData: (data: any) => void;
}

export default function IntroductionCard({
  editing,
  data,
  setData,
}: IntroductionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction Section</CardTitle>
        <CardDescription>
          Configure the introduction content that appears below the hero section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="intro-title">Intro Title</Label>
          {editing ? (
            <Input
              id="intro-title"
              type="text"
              value={data.intro_title}
              onChange={(e) =>
                setData({ ...data, intro_title: e.target.value })
              }
            />
          ) : (
            <p className="text-sm font-medium">{data.intro_title}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="intro-description">Intro Description</Label>
          {editing ? (
            <Textarea
              id="intro-description"
              value={data.intro_description}
              onChange={(e) =>
                setData({ ...data, intro_description: e.target.value })
              }
              rows={4}
            />
          ) : (
            <p className="text-sm">{data.intro_description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
