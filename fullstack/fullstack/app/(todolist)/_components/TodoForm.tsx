"use client";
import { createTodo } from "@/app/lib/services";
import { Plus, Loader2, Lock } from "lucide-react";
import { useRef, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function TodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    if (!isAuthenticated) return setError("AUTH_REQUIRED_");

    const task = formData.get("task") as string;
    if (!task || task.trim().length === 0) return setError("EMPTY_TASK_");

    startTransition(async () => {
      const res = await createTodo(task);
      if (res.success) {
        formRef.current?.reset();
        router.refresh();
      } else {
        setError(res.error || "SERVER_ERROR_");
      }
    });
  };

  return (
    <div className="mb-10">
      <form
        ref={formRef}
        action={handleSubmit}
        className={`relative transition-all duration-200 ${
          isPending ? "opacity-70 cursor-wait" : "opacity-100"
        }`}
      >
        {/* Clean White Input Card */}
        <input
          name="task"
          type="text"
          disabled={isPending || !isAuthenticated}
          placeholder={
            isAuthenticated
              ? "Add a new task..."
              : "Please sign in to add tasks"
          }
          autoComplete="off"
          onChange={() => error && setError(null)}
          className={`w-full bg-white border rounded-2xl py-5 pl-7 pr-16 text-[15px] font-medium text-[#202124] placeholder:text-gray-400 focus:outline-none transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${
            error
              ? "border-red-200 focus:border-red-400"
              : "border-gray-100 focus:border-blue-400"
          } ${!isAuthenticated ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />

        {/* Floating Action Button */}
        <button
          type="submit"
          disabled={isPending || !isAuthenticated}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl transition-all flex items-center justify-center shadow-lg ${
            isAuthenticated
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 active:scale-95"
              : "bg-gray-200 text-gray-400 shadow-none"
          }`}
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : !isAuthenticated ? (
            <Lock size={18} />
          ) : (
            <Plus size={24} strokeWidth={3} />
          )}
        </button>
      </form>

      {/* Clean Error Message */}
      {error && (
        <p className="mt-3 ml-4 text-xs font-semibold text-red-500 uppercase tracking-wider">
          {error.replace("_", " ")}
        </p>
      )}
    </div>
  );
}
