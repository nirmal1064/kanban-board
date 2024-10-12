import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormType, loginSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { KanbanSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormType) {
    try {
      setSubmitting(true);
      await loginUser(data);
      toast.success("Login Successful", { id: "login" });
      reset();
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again later.", {
        id: "login",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mb-6 flex items-center gap-2">
        <KanbanSquare
          className="h-[30px] w-[30px] text-rose-500"
          strokeWidth={2.75}
        />
        <h1
          className={cn(
            "bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 bg-clip-text text-3xl font-bold text-transparent",
            "pointer-events-none select-none"
          )}
        >
          Kanban Board
        </h1>
      </div>

      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              required
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              required
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-rose-500 font-bold text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-500 dark:focus:ring-offset-gray-900"
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-rose-500 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
