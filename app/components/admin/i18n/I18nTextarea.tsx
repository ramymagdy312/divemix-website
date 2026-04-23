"use client";

import I18nTextField, { type I18nValue } from "./I18nTextField";

interface I18nTextareaProps {
  label?: string;
  value: unknown;
  onChange: (value: I18nValue) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  helperText?: string;
}

export default function I18nTextarea(props: I18nTextareaProps) {
  return <I18nTextField {...props} as="textarea" rows={props.rows ?? 4} />;
}
