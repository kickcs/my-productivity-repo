"use client";

import { useCallback, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "@/shared/ui";
import { useDeleteAllRatings } from "@/entities/day-rating";

export function ClearDataButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const deleteAllRatings = useDeleteAllRatings();

  const handleClick = useCallback(() => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    deleteAllRatings.mutate(undefined, {
      onSettled: () => {
        setIsConfirming(false);
      },
    });
  }, [isConfirming, deleteAllRatings]);

  const handleCancel = useCallback(() => {
    setIsConfirming(false);
  }, []);

  if (isConfirming) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCancel}
          disabled={deleteAllRatings.isPending}
        >
          Отмена
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={handleClick}
          disabled={deleteAllRatings.isPending}
        >
          {deleteAllRatings.isPending ? "Удаление..." : "Подтвердить"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="destructive"
      className="w-full justify-start gap-3"
      onClick={handleClick}
    >
      <IconTrash className="size-4" />
      Удалить все данные
    </Button>
  );
}
