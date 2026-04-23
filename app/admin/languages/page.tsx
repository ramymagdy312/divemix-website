"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Languages as LanguagesIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

import { supabase } from "@/app/lib/supabase";
import { triggerRevalidate } from "@/app/lib/revalidate-client";
import {
  locales as staticLocales,
  localeFlags,
  localeNames,
  type LanguageSetting,
} from "@/app/lib/i18n/config";
import { notifyLanguagesUpdated } from "@/app/lib/i18n/LanguagesProvider";

type EditableLanguage = LanguageSetting;

interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}

function validate(langs: EditableLanguage[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (langs.length === 0) {
    issues.push({ level: "error", message: "You must have at least one language." });
    return issues;
  }

  const codes = new Set<string>();
  for (const l of langs) {
    if (!/^[a-z]{2,3}(-[A-Za-z0-9]+)?$/i.test(l.code)) {
      issues.push({
        level: "error",
        message: `"${l.code}" is not a valid locale code.`,
      });
    }
    if (codes.has(l.code)) {
      issues.push({
        level: "error",
        message: `Duplicate locale code "${l.code}".`,
      });
    }
    codes.add(l.code);
  }

  const enabled = langs.filter((l) => l.enabled);
  if (enabled.length === 0) {
    issues.push({ level: "error", message: "At least one language must be enabled." });
  }

  const defaults = langs.filter((l) => l.is_default);
  if (defaults.length === 0) {
    issues.push({ level: "error", message: "You must pick a default language." });
  } else if (defaults.length > 1) {
    issues.push({
      level: "error",
      message: "Only one language can be the default.",
    });
  } else if (!defaults[0].enabled) {
    issues.push({
      level: "error",
      message: "The default language must be enabled.",
    });
  }

  const fallbacks = langs.filter((l) => l.is_fallback);
  if (fallbacks.length === 0) {
    issues.push({
      level: "error",
      message: "You must pick a required fallback language.",
    });
  } else if (fallbacks.length > 1) {
    issues.push({
      level: "error",
      message: "Only one language can be the required fallback.",
    });
  } else if (!fallbacks[0].enabled) {
    issues.push({
      level: "error",
      message: "The fallback language must be enabled.",
    });
  }

  const staticSet = new Set<string>(staticLocales);
  for (const l of langs) {
    if (!staticSet.has(l.code)) {
      issues.push({
        level: "warning",
        message: `"${l.code}" is not yet compiled into the app. Ship a messages/${l.code}.json file and add the code to app/lib/i18n/config.ts to make it fully functional.`,
      });
    }
  }

  return issues;
}

function withOrderApplied(langs: EditableLanguage[]): EditableLanguage[] {
  return langs.map((l, i) => ({ ...l, display_order: i }));
}

export default function LanguagesAdminPage() {
  const [languages, setLanguages] = useState<EditableLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newNative, setNewNative] = useState("");
  const [newFlag, setNewFlag] = useState("");
  const [newRtl, setNewRtl] = useState(false);

  const fetchLanguages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("language_settings")
        .select(
          "code, name, native_name, flag, enabled, is_default, is_fallback, is_rtl, display_order"
        )
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching languages:", error);
        toast.error("Failed to load languages");
        return;
      }

      setLanguages((data ?? []) as EditableLanguage[]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load languages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLanguages();
  }, [fetchLanguages]);

  const issues = useMemo(() => validate(languages), [languages]);
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");

  const patch = (code: string, updates: Partial<EditableLanguage>) => {
    setLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, ...updates } : l))
    );
  };

  const setEnabled = (code: string, enabled: boolean) => {
    setLanguages((prev) =>
      prev.map((l) => {
        if (l.code !== code) return l;
        // Don't let the admin disable the current default or fallback.
        if (!enabled && (l.is_default || l.is_fallback)) {
          toast.error(
            l.is_default
              ? "Pick a different default language first."
              : "Pick a different fallback language first."
          );
          return l;
        }
        return { ...l, enabled };
      })
    );
  };

  const setDefault = (code: string) => {
    setLanguages((prev) =>
      prev.map((l) => ({
        ...l,
        is_default: l.code === code,
        enabled: l.code === code ? true : l.enabled,
      }))
    );
  };

  const setFallback = (code: string) => {
    setLanguages((prev) =>
      prev.map((l) => ({
        ...l,
        is_fallback: l.code === code,
        enabled: l.code === code ? true : l.enabled,
      }))
    );
  };

  const move = (code: string, direction: -1 | 1) => {
    setLanguages((prev) => {
      const index = prev.findIndex((l) => l.code === code);
      if (index < 0) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return withOrderApplied(next);
    });
  };

  const removeLanguage = (code: string) => {
    setLanguages((prev) => {
      const target = prev.find((l) => l.code === code);
      if (!target) return prev;
      if (target.is_default) {
        toast.error("Pick a different default language before removing this one.");
        return prev;
      }
      if (target.is_fallback) {
        toast.error("Pick a different fallback language before removing this one.");
        return prev;
      }
      return withOrderApplied(prev.filter((l) => l.code !== code));
    });
  };

  const addLanguage = () => {
    const code = newCode.trim().toLowerCase();
    if (!code) {
      toast.error("Enter a locale code (e.g. fr, es, it)");
      return;
    }
    if (!/^[a-z]{2,3}(-[a-z0-9]+)?$/i.test(code)) {
      toast.error(`"${code}" is not a valid locale code`);
      return;
    }
    if (languages.some((l) => l.code === code)) {
      toast.error(`${code} is already in the list`);
      return;
    }
    const name = newName.trim() || code.toUpperCase();
    const native = newNative.trim() || name;
    const flag = newFlag.trim() || localeFlags[code as never] || null;

    setLanguages((prev) =>
      withOrderApplied([
        ...prev,
        {
          code,
          name,
          native_name: native,
          flag,
          enabled: false,
          is_default: false,
          is_fallback: false,
          is_rtl: newRtl,
          display_order: prev.length,
        },
      ])
    );

    setNewCode("");
    setNewName("");
    setNewNative("");
    setNewFlag("");
    setNewRtl(false);
    setShowAdd(false);
    toast.success(`${code} added. Enable it when translations are ready.`);
  };

  const handleSave = async () => {
    if (errors.length > 0) {
      toast.error(errors[0].message);
      return;
    }

    setSaving(true);
    try {
      const payload = withOrderApplied(languages);

      // 1. Delete rows that no longer exist.
      const keep = payload.map((l) => l.code);
      if (keep.length > 0) {
        const { error: delError } = await supabase
          .from("language_settings")
          .delete()
          .not(
            "code",
            "in",
            `(${keep.map((c) => `"${c}"`).join(",")})`
          );
        if (delError) {
          console.error(delError);
          toast.error(`Failed to remove old languages: ${delError.message}`);
          return;
        }
      }

      // 2. Reset default/fallback flags first so the partial unique
      // indexes do not conflict during the upsert.
      const { error: resetError } = await supabase
        .from("language_settings")
        .update({ is_default: false, is_fallback: false })
        .neq("code", "___never___");
      if (resetError) {
        console.error(resetError);
        toast.error(`Failed to reset flags: ${resetError.message}`);
        return;
      }

      // 3. Upsert new state.
      const { error: upsertError } = await supabase
        .from("language_settings")
        .upsert(payload, { onConflict: "code" });
      if (upsertError) {
        console.error(upsertError);
        toast.error(`Failed to save languages: ${upsertError.message}`);
        return;
      }

      // 4. Invalidate every cache that depends on language settings.
      await triggerRevalidate([
        "language-settings",
        "nav",
        "footer",
        "settings",
        "home",
        "seo",
      ]);

      // 5. Tell every mounted client tree (admin editors, language
      // switcher) to re-fetch immediately so tabs update without a
      // page reload. Cross-tab sync piggy-backs on `storage`.
      notifyLanguagesUpdated();
      try {
        localStorage.setItem(
          "divemix:languages-updated",
          String(Date.now())
        );
      } catch {
        /* storage may be unavailable */
      }

      toast.success("Language settings saved");
      await fetchLanguages();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save language settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <LanguagesIcon className="h-8 w-8 mr-3 text-primary" />
            Language Settings
          </h1>
          <p className="text-muted-foreground">
            Control which languages are available on the public site, the
            default language, the required fallback, and the order of the
            language switcher.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving || errors.length > 0}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((e, i) => (
                <li key={i}>{e.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1">
              {warnings.map((w, i) => (
                <li key={i}>{w.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configured languages</CardTitle>
              <CardDescription>
                Use the arrows to reorder, the switches to enable/disable, and
                the radios to pick the default and required fallback.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdd((v) => !v)}
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add language
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAdd && (
            <div className="rounded-lg border p-4 grid grid-cols-1 md:grid-cols-6 gap-4 bg-muted/30">
              <div className="md:col-span-1">
                <Label htmlFor="new-code">Code</Label>
                <Input
                  id="new-code"
                  placeholder="fr"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="new-name">English name</Label>
                <Input
                  id="new-name"
                  placeholder="French"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="new-native">Native name</Label>
                <Input
                  id="new-native"
                  placeholder="Français"
                  value={newNative}
                  onChange={(e) => setNewNative(e.target.value)}
                />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="new-flag">Flag</Label>
                <Input
                  id="new-flag"
                  placeholder="🇫🇷"
                  value={newFlag}
                  onChange={(e) => setNewFlag(e.target.value)}
                />
              </div>
              <div className="md:col-span-6 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={newRtl} onCheckedChange={setNewRtl} />
                  Right-to-left script
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setShowAdd(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={addLanguage}>
                    <Check className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead className="w-[120px] text-center">Enabled</TableHead>
                  <TableHead className="w-[120px] text-center">Default</TableHead>
                  <TableHead className="w-[140px] text-center">
                    Fallback
                  </TableHead>
                  <TableHead className="w-[110px] text-center">RTL</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.map((lang, index) => {
                  const isFirst = index === 0;
                  const isLast = index === languages.length - 1;
                  const isKnown = (staticLocales as readonly string[]).includes(
                    lang.code
                  );
                  return (
                    <TableRow key={lang.code}>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={isFirst}
                            onClick={() => move(lang.code, -1)}
                            aria-label="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={isLast}
                            onClick={() => move(lang.code, 1)}
                            aria-label="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">
                            {lang.flag ||
                              localeFlags[lang.code as never] ||
                              "🌐"}
                          </span>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {lang.native_name ||
                                lang.name ||
                                localeNames[lang.code as never] ||
                                lang.code.toUpperCase()}
                              {!isKnown && (
                                <Badge variant="outline" className="text-xs">
                                  pending
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {lang.code.toUpperCase()}
                              {lang.name && lang.name !== lang.native_name
                                ? ` · ${lang.name}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={lang.enabled}
                          onCheckedChange={(v) => setEnabled(lang.code, v)}
                          aria-label={`Enable ${lang.code}`}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="radio"
                          name="default-language"
                          aria-label={`Make ${lang.code} default`}
                          checked={lang.is_default}
                          onChange={() => setDefault(lang.code)}
                          className="h-4 w-4 accent-cyan-600"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="radio"
                          name="fallback-language"
                          aria-label={`Make ${lang.code} fallback`}
                          checked={lang.is_fallback}
                          onChange={() => setFallback(lang.code)}
                          className="h-4 w-4 accent-cyan-600"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={lang.is_rtl}
                          onCheckedChange={(v) =>
                            patch(lang.code, { is_rtl: v })
                          }
                          aria-label={`Toggle RTL for ${lang.code}`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              disabled={lang.is_default || lang.is_fallback}
                              aria-label={`Remove ${lang.code}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove {lang.code.toUpperCase()}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the {lang.code} language from
                                the public site. Existing translations for this
                                locale stored on other tables will remain but
                                become unreachable until you re-add it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeLanguage(lang.code)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            Changes take effect as soon as you save; caches are invalidated
            automatically for every locale. Disabled languages redirect to the
            default language on the public site and disappear from the language
            switcher.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
