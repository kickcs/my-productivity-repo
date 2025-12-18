"use client";

import { useCallback } from "react";
import { Textarea } from "@/shared/ui";
import { MAX_COMMENT_LENGTH } from "@/shared/config/constants";

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CommentInput({ value, onChange }: CommentInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= MAX_COMMENT_LENGTH) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
      <label className="block text-sm font-medium mb-2 pl-1">
        Комментарий
      </label>
      <div className="relative">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="Напишите, что вам запомнилось сегодня..."
          className="min-h-[140px] pr-16"
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground font-medium bg-background/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
          {value.length}/{MAX_COMMENT_LENGTH}
        </div>
      </div>
    </div>
  );
}
