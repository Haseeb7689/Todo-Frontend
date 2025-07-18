"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import Logout from "@/components/ui/Logout";
import { toast } from "sonner";
import { ModeToggle } from "@/components/ui/mode-toggle";

type Todos = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todos[]>([]);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchTodos = async (authToken: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!token) {
      alert("You must be logged in to add a todo.");
      return;
    }
    if (!todo.trim()) {
      toast.error("Please enter a valid todo.");
      return;
    }
    const sanitizedTodo = todo.replace(/<[^>]*>?/gm, "");
    const addPromise = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: sanitizedTodo, completed: false }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add todo");
      }
      setTodo("");
      fetchTodos(token);
    };
    toast.promise(addPromise(), {
      loading: "Adding your todo...",
      success: "Todo added successfully!",
      error: (err) => err.message || "Something went wrong",
    });
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    if (!token) {
      toast.error("You must be logged in to toggle a todo.");
      return;
    }
    const addPromise = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completed: !completed }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add todo");
      }
      fetchTodos(token);
    };
    toast.promise(addPromise(), {
      loading: "Updating your todo...",
      success: "Todo updated successfully!",
      error: (err) => err.message || "Something went wrong",
    });
  };

  const deleteTodo = async (id: number) => {
    if (!token) {
      toast.error("You must be logged in to delete a todo.");
      return;
    }
    const deletePromise = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete todo");
      }
    };
    fetchTodos(token);
    toast.promise(deletePromise(), {
      loading: "Deleting your todo...",
      success: "Todo deleted successfully!",
      error: (err) => err.message || "Something went wrong",
    });
  };

  const handleLogout = () => {
    const logoutPromise = async () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          localStorage.removeItem("token");
          router.push("/login");
          resolve();
        }, 3000);
      });
    };

    toast.promise(logoutPromise(), {
      loading: "Logging out...",
      success: "Logout successful!",
      error: (err) => err.message || "Something went wrong",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/register");
      } else {
        setIsCheckingAuth(false);
        setToken(storedToken);
        fetchTodos(storedToken);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 ">
      <div className="absolute top-5 left-0 ml-5">
        <ModeToggle />
      </div>

      <div className="flex items-center justify-between mb-6 w-full max-w-xl relative">
        <div className="mx-auto">
          <h1 className=" text-3xl md:text-4xl font-bold text-gray-800 text-center dark:text-white">
            Todo App
          </h1>
        </div>
        <div className="absolute right-0 ">
          <Logout onClick={handleLogout} />
        </div>
      </div>

      <div className="flex w-full max-w-xl">
        <Input
          placeholder="Add todo"
          value={todo}
          className="w-full text-lg bg-amber-400 dark:bg-amber-400"
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button
          onClick={addTodo}
          disabled={!todo.trim()}
          className="ml-2 bg-green-500 hover:bg-green-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:text-white"
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
