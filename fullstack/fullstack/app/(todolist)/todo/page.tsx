import { prisma } from "@/app/lib/prisma";
import { Suspense } from "react";
import TodoForm from "../_components/TodoForm";
import TodoClient from "./_components/TodoClient";

export default async function TodosPage() {
  const todosPromise = prisma.todos.findMany({
    orderBy: { updated_at: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#202124] selection:bg-blue-100">
      <div className="max-w-2xl mx-auto pt-32 pb-20 px-6">
        {/* Simplified Header like 'TTD' app */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#202124]">
              Daily <span className="text-blue-600">Tasks</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">
              Organize your workflow and stay productive.
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <section className="mb-8">
          <TodoForm />
        </section>

        <Suspense
          fallback={
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse shadow-sm"
                />
              ))}
            </div>
          }
        >
          <TodoClient todosPromise={todosPromise} />
        </Suspense>
      </div>
    </main>
  );
}
