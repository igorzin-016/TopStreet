import React from "react";

const STEPS = ["Dados do piloto", "Veículo e categoria", "Confirmação"];

interface ProgressStepsProps {
  /** índice (0-based) da etapa ativa */
  current: number;
}

export function ProgressSteps({ current }: ProgressStepsProps) {
  return (
    <div
      className="flex items-center"
      role="list"
      aria-label="Progresso do cadastro"
    >
      {STEPS.map((label, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <React.Fragment key={label}>
            <div
              role="listitem"
              aria-current={isActive ? "step" : undefined}
              className="flex items-center gap-2 shrink-0"
            >
              <span
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  background: isDone ? "#C6FF4D" : isActive ? "#E42313" : "#3A3836",
                }}
              />
              <span
                className={`hidden sm:inline text-[11px] uppercase tracking-wide font-mono ${
                  isActive ? "text-[#F3F1EA]" : "text-[#6E6A60]"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-3"
                style={{ background: "#3A3836" }}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}


