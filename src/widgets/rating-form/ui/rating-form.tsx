"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/shared/ui";
import { formatDateRu } from "@/entities/day-rating";
import { ScoreSelector, CommentInput } from "@/features/rate-day";
import { PageHeader } from "@/widgets/page-header";
import { BottomNav } from "@/widgets/bottom-navigation";
import { useRatingForm } from "../model/use-rating-form";

interface RatingFormProps {
  date: Date;
}

export function RatingForm({ date }: RatingFormProps) {
  const dateStr = date.toISOString().split("T")[0];
  const {
    selectedScore,
    setSelectedScore,
    comment,
    setComment,
    handleSave,
    handleClose,
    isSaving,
  } = useRatingForm(dateStr);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <PageHeader title={formatDateRu(date)} onClose={handleClose} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 pt-6 pb-44 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Оцените свой день
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Ваша история сохраняется в календаре
          </p>
        </div>

        {/* Score Grid */}
        <div className="mb-10">
          <ScoreSelector
            selectedScore={selectedScore}
            onScoreSelect={setSelectedScore}
          />
        </div>

        {/* Comment Section */}
        <CommentInput value={comment} onChange={setComment} />
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-[72px] left-0 w-full z-40">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t border-border" />
        <div className="relative px-5 pb-4 pt-4">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleSave}
              disabled={selectedScore === null || isSaving}
              className="w-full h-12 text-base font-semibold gap-2 rounded-xl shadow-lg shadow-primary/20"
            >
              <span>{isSaving ? "Сохранение..." : "Сохранить оценку"}</span>
              {!isSaving && <IconArrowRight className="size-4" />}
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
