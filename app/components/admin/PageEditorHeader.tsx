// components/PageHeader.tsx
import { FileText, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageEditorHeaderProps {
  title: string;
  editing: boolean;
  setEditing: (value: boolean) => void;
  saving?: boolean;
  handleSave?: () => void;
}

export default function PageEditorHeader({
  title,
  editing,
  setEditing,
  saving = false,
  handleSave,
}: PageEditorHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <FileText className="h-8 w-8 mr-3 text-primary" />
          {title} Management
        </h1>
        <p className="text-muted-foreground">
          Manage the content of your {title.toLowerCase()}
        </p>
      </div>
      <div className="flex space-x-2">
        {editing ? (
          <>
            <Button variant="outline" onClick={() => setEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Page
          </Button>
        )}
      </div>
    </div>
  );
}
