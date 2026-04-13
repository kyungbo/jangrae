"use client";

import { useState } from "react";
import { personTypes, getCategoriesForPerson, type PersonType, type AdminTask } from "@/data/post-funeral";
import { Check, ChevronDown, ChevronUp, Phone, FileText } from "lucide-react";

export default function PostFuneralInteractive() {
  const [personType, setPersonType] = useState<PersonType>("all");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = getCategoriesForPerson(personType);

  const toggleTask = (taskId: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setCompletedTasks(newSet);
  };

  const totalTasks = categories.reduce((sum, c) => sum + c.tasks.length, 0);
  const completedCount = categories.reduce(
    (sum, c) => sum + c.tasks.filter((t) => completedTasks.has(t.id)).length,
    0
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* 관계 선택 */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-navy mb-3">고인과의 관계를 선택하세요</h2>
        <p className="text-xs text-text-secondary mb-4">해당되는 행정 절차만 필터링하여 보여드립니다.</p>
        <div className="flex flex-wrap gap-2">
          {personTypes.map((pt) => (
            <button
              key={pt.id}
              onClick={() => setPersonType(pt.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                personType === pt.id
                  ? "bg-navy text-white"
                  : "bg-white border border-border text-text-secondary hover:border-navy-light"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 진행률 */}
      <div className="bg-white rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-secondary">전체 진행률</span>
          <span className="font-semibold text-navy">{completedCount} / {totalTasks}건 완료</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-success h-2 rounded-full transition-all duration-300"
            style={{ width: totalTasks > 0 ? `${(completedCount / totalTasks) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {/* 카테고리별 체크리스트 */}
      <div className="space-y-3">
        {categories.map((category) => {
          const catCompleted = category.tasks.filter((t) => completedTasks.has(t.id)).length;
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream-dark/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    catCompleted === category.tasks.length && category.tasks.length > 0
                      ? "bg-success text-white"
                      : "bg-cream-dark text-navy"
                  }`}>
                    {catCompleted === category.tasks.length && category.tasks.length > 0 ? (
                      <Check size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-navy text-sm">{category.name}</h3>
                    <p className="text-xs text-text-secondary">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-accent font-medium hidden sm:block">{category.deadline}</span>
                  <span className="text-xs text-text-secondary">{catCompleted}/{category.tasks.length}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border px-5 py-4 space-y-4">
                  {category.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      completed={completedTasks.has(task.id)}
                      onToggle={() => toggleTask(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskItem({
  task,
  completed,
  onToggle,
}: {
  task: AdminTask;
  completed: boolean;
  onToggle: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className={`rounded-lg border p-4 transition-all ${completed ? "border-success/30 bg-green-50/50" : "border-border"}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
            completed ? "bg-success border-success text-white" : "border-border hover:border-navy"
          }`}
        >
          {completed && <Check size={14} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-semibold text-sm ${completed ? "text-text-secondary line-through" : "text-navy"}`}>
              {task.title}
            </h4>
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="text-xs text-navy underline shrink-0"
            >
              {showDetail ? "접기" : "상세"}
            </button>
          </div>
          <p className="text-xs text-text-secondary mt-1">{task.description}</p>

          {showDetail && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="bg-cream-dark rounded p-3">
                <p className="font-medium text-navy mb-1">어디서?</p>
                <p className="text-text-secondary">{task.where}</p>
              </div>
              <div className="bg-cream-dark rounded p-3">
                <p className="font-medium text-navy mb-1">필요 서류</p>
                <ul className="text-text-secondary space-y-0.5">
                  {task.documents.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 text-accent font-medium">
                기한: {task.deadline}
              </div>
              {task.tip && (
                <div className="bg-blue-50 rounded p-3 text-navy/80">
                  💡 {task.tip}
                </div>
              )}
              {task.phone && (
                <a
                  href={`tel:${task.phone}`}
                  className="inline-flex items-center gap-1 bg-navy text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                  <Phone size={12} /> {task.phone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
