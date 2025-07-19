"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import Logout from "@/components/ui/Logout";
import { toast } from "sonner";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

type Todos = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todos[]>([]);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todos | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch todos from the API
  const fetchTodos = async (authToken: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const apiRes = await res.json();
    setTodos(apiRes.data);
  };

  // Add a new todo
  const addTodo = async () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      if (!token) {
        toast.error("You must be logged in to add a todo.");
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
            body: JSON.stringify({ title: sanitizedTodo }),
          }
        );
        const apiRes = await res.json();

        if (!res.ok) {
          throw new Error(apiRes.message || "Failed to add todo");
        }
        setTodo("");
        fetchTodos(token);
        return apiRes;
      };
      toast.promise(addPromise(), {
        loading: "Adding your todo...",
        success: (apiRes) => apiRes.message,
        error: (err) => err.message || "Something went wrong",
      });
    }, 1000);
  };

  // Toggle todo completion status
  const toggleTodo = async (id: number, completed: boolean) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      if (!token) {
        toast.error("You must be logged in to toggle a todo.");
        return;
      }
      const addPromise = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos/${id}/completed`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ completed: !completed }),
          }
        );
        const apiRes = await res.json();
        if (!res.ok) {
          throw new Error(apiRes.message || "Failed to add todo");
        }
        fetchTodos(token);
        return apiRes;
      };
      toast.promise(addPromise(), {
        loading: "Updating your todo...",
        success: (apiRes) => apiRes.message,
        error: (err) => err.message || "Something went wrong",
      });
    }, 1000);
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
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
        const apiRes = await res.json();
        if (!res.ok) {
          throw new Error(apiRes.message || "Failed to add todo");
        }
        fetchTodos(token);
        return apiRes;
      };

      toast.promise(deletePromise(), {
        loading: "Deleting your todo...",
        success: (apiRes) => apiRes.message,
        error: (err) => err.message || "Something went wrong",
      });
    }, 1000);
  };

  // Delete all todos
  const deleteAllTodos = async () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (!token) {
        toast.error("You must be logged in to delete todos.");
        return;
      }

      const deleteAllPromise = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos/deletealltodos`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const apiRes = await res.json();
        if (!apiRes.data) {
          throw new Error(apiRes.message || "Failed to delete todos");
        }
        if (!res.ok) {
          throw new Error(apiRes.message);
        }

        fetchTodos(token);
        return apiRes;
      };

      toast.promise(deleteAllPromise(), {
        loading: "Deleting all todos...",
        success: (apiRes) => apiRes.message,
        error: (err) => err.message || "Something went wrong",
      });
    }, 1000);
  };

  // Start editing a todo
  const startEditing = (todo: Todos) => {
    setEditingTodo(todo);
    setEditedTitle(todo.title);
  };

  // Save edited todo
  const saveTodo = async (id: number) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (editedTitle.trim() === "" || null) {
      toast.error("Please enter a valid title.");
      return;
    }
    if (editedTitle.trim() === editingTodo?.title.trim()) {
      toast.error("No changes made to the title.");
      return;
    }
    debounceTimeout.current = setTimeout(async () => {
      if (!token) {
        toast.error("Login first");
        return;
      }
      const editPromise = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: editedTitle }),
          }
        );

        setEditingTodo(null);
        const apiRes = await res.json();

        if (!res.ok) {
          throw new Error(apiRes.message);
        }
        fetchTodos(token);
        return apiRes;
      };

      toast.promise(editPromise(), {
        loading: "Editing todo...",
        success: (apiRes) => apiRes.message,
        error: (err) => err.message || "Something went wrong",
      });
    }, 1000);
  };

  // Handle logout

  const handleLogout = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
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
    }, 1000);
  };

  // Check if user is authenticated

  useEffect(() => {
    const timer = setTimeout(async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/register");
      } else {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/todos`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );

          if (!res.ok) {
            localStorage.removeItem("token");
            toast.error("Session expired. Please log in again.");
            router.push("/register");
            return;
          }

          setIsCheckingAuth(false);
          setToken(storedToken);
          fetchTodos(storedToken);
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          router.push("/register");
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsDisabled(!todo.trim());
  }, [todo]);

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

      <div className="flex w-full max-w-xl gap-2">
        <Input
          placeholder="Add todo"
          value={todo}
          className="w-full text-lg bg-amber-400 dark:bg-amber-400"
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <Button
          onClick={addTodo}
          disabled={isDisabled}
          className=" w-10 rounded-md hover:cursor-pointer bg-green-500 hover:bg-green-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:text-white"
        >
          +
        </Button>
        <Button
          onClick={deleteAllTodos}
          className="hover:cursor-pointer rounded-md bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
        >
          <RiDeleteBin2Fill />
          <span>all</span>
        </Button>
      </div>

      <ul className="mt-6 w-full max-w-xl space-y-2">
        {todos.map((t) => (
          <li
            key={t.id}
            className="bg-pink-200 p-3 rounded shadow flex justify-between items-center"
          >
            {editingTodo?.id === t.id ? (
              <div className="relative w-1/2">
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border p-1 rounded mr-2 bg-white dark:bg-gray-700 "
                />
                <div className="flex gap-2 mt-2 absolute top-8 left-20">
                  <button
                    onClick={() => saveTodo(t.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm hover:cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 text-sm hover:cursor-pointer
                    "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-1/2">
                <span
                  className={`text-lg ${
                    t.completed ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {t.title}
                </span>
              </div>
            )}

            <div className="w-1/3 text-center">
              <span className="text-sm text-gray-400">
                {new Date(t.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="w-1/3 flex justify-end items-center gap-3">
              <button
                onClick={() => startEditing(t)}
                disabled={t.completed}
                className="hover:cursor-pointer text-black hover:text-green-500 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <CiEdit className="w-6 h-6 " />
              </button>

              <Checkbox
                checked={t.completed}
                onCheckedChange={() => toggleTodo(t.id, t.completed)}
                className="hover:cursor-pointer w-5 h-5 border-black "
              />
              <Button
                onClick={() => deleteTodo(t.id)}
                className="hover:cursor-pointer rounded-md bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
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
