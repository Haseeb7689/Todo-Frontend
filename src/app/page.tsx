"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Todos = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todos[]>([]);

  const fetchTodos = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos`
    );
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (todo.trim()) {
      const sanitizedTodo = todo.replace(/<[^>]*>?/gm, "");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: sanitizedTodo, completed: false }),
      });
      setTodo("");
      fetchTodos();
    } else {
      console.log("Enter a valid todo");
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Todo App</h1>
      <div className="flex w-full max-w-xl">
        <Input
          placeholder="Add todo"
          value={todo}
          className="w-full text-lg bg-amber-400"
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button
          onClick={addTodo}
          className="ml-2 bg-green-500 hover:bg-green-400"
        >
          +
        </Button>
      </div>
      <ul className="mt-6 w-full max-w-xl space-y-2">
        {todos.map((t) => (
          <li
            key={t.id}
            className="bg-white p-3 rounded shadow flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-lg ${
                  t.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {t.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={t.completed}
                onCheckedChange={() => toggleTodo(t.id, t.completed)}
                className="w-5 h-5 border-gray-400 text-green-600"
              />
              <Button
                onClick={() => deleteTodo(t.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
