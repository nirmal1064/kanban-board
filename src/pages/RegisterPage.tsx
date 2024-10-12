import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { RegisterFormType, registerSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { KanbanSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormType) {
    setIsSubmitting(true);
    try {
      registerUser(data);
      toast.success("Account Registered Successfully. Login to ccontinue", {
        id: "register",
      });
      reset();
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again later.", {
        id: "register",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center gap-2">
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
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Enter your Name"
              className="mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              required
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>

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
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className="mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-500 font-bold text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-500 dark:focus:ring-offset-gray-900"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-rose-500 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
