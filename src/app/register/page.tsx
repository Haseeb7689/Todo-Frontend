"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeToggle } from "@/components/ui/mode-toggle";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email"),
    Password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.Password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const router = useRouter();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const watchEmail = watch("email");
  const watchPassword = watch("Password");
  const watchConfirmPassword = watch("confirmPassword");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleRegister = async (data: RegisterFormData) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      const registerPromise = fetch(
        `${process.env.NEXT_PUBLIC_API_URL_RESPONSE}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, Password: data.Password }),
        }
      ).then(async (res) => {
        const apiRes = await res.json();

        if (apiRes.data.token) {
          localStorage.setItem("token", apiRes.data.token);
          router.push("/login");
        } else {
          throw new Error(apiRes.message || "Registration failed");
        }
      });

      toast.promise(registerPromise, {
        loading: "Registering...",
        success: "Registration successful!",
        error: "Error during registration",
      });
    }, 2000);
  };

  useEffect(() => {
    const isFormInvalid =
      !watchEmail?.trim() ||
      !watchPassword?.trim() ||
      !watchConfirmPassword?.trim() ||
      watchPassword !== watchConfirmPassword;

    setIsDisabled(isFormInvalid);
  }, [watchEmail, watchPassword, watchConfirmPassword]);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="absolute top-5 left-0 ml-5">
        <ModeToggle />
      </div>
      <div className="sm:mx-auto mt-4 sm:w-full sm:max-w-sm border border-gray-300 shadow-lg bg-white dark:bg-gray-800 p-8 rounded-lg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Sign up to new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit(handleRegister)}
          >
            <div>
              <label
                htmlFor="email"
                id="email-label"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="Password"
                  id="password-label"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("Password")}
                  id="Password"
                  name="Password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                />
                {errors.Password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.Password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  id="confirm-password-label"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1 animate-caret-blink">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isDisabled}
                className="flex w-full hover:cursor-pointer justify-center rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-600 hover:text-green-500"
            >
              Sign in now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
