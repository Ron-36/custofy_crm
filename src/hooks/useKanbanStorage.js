import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../utils/constant";

export function useKanbanStorage() {
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  return [leads, setLeads];
}
