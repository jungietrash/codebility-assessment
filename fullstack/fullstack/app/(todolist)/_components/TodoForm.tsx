"use client";
import { createCookingOrder } from "@/app/lib/services"; // Updated service call
import { ChefHat, Loader2, Lock, UtensilsCrossed } from "lucide-react";
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

    const dishName = formData.get("task") as string;
    if (!dishName || dishName.trim().length === 0)
      return setError("WHAT_ARE_WE_COOKING?");

    startTransition(async () => {
      // res now triggers the Grok AI logic in the background
      const res = await createCookingOrder(dishName);
      if (res.success) {
        formRef.current?.reset();
        router.refresh();
      } else {
        setError(res.error || "CHEF_IS_BUSY_");
      }
    });
  };

  return (
    <div className="mb-10">
      <form
        ref={formRef}
        action={handleSubmit}
        className={`relative transition-all duration-300 ${
          isPending ? "scale-[0.99] opacity-80" : "scale-100 opacity-100"
        }`}
      >
        {/* Culinary Input Card */}
        <input
          name="task"
          type="text"
          disabled={isPending || !isAuthenticated}
          placeholder={
            isAuthenticated
              ? "Enter a dish (e.g. Beef Pares or Carbonara)..."
              : "Sign in to start the kitchen"
          }
          autoComplete="off"
          onChange={() => error && setError(null)}
          className={`w-full bg-white border rounded-2xl py-5 pl-14 pr-20 text-[15px] font-medium text-[#202124] placeholder:text-gray-400 focus:outline-none transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${
            error
              ? "border-red-200 focus:border-red-400"
              : "border-gray-100 focus:border-orange-400"
          } ${!isAuthenticated ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />

        {/* Decorative Icon inside input */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
          <ChefHat size={20} />
        </div>

        {/* Action Button: Changes to Utensils when ready */}
        <button
          type="submit"
          disabled={isPending || !isAuthenticated}
          className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 h-11 rounded-xl transition-all flex items-center gap-2 shadow-lg ${
            isAuthenticated
              ? "bg-[#202124] text-white hover:bg-black active:scale-95"
              : "bg-gray-200 text-gray-400 shadow-none"
          }`}
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Generating...
              </span>
            </>
          ) : !isAuthenticated ? (
            <Lock size={18} />
          ) : (
            <>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                Order
              </span>
              <UtensilsCrossed size={18} />
            </>
          )}
        </button>
      </form>

      {/* Culinary Feedback Message */}
      {error && (
        <div className="mt-3 ml-4 flex items-center gap-2 text-red-500">
          <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
            {error.replace("_", " ")}
          </p>
        </div>
      )}
    </div>
  );
}
