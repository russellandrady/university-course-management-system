import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MainButton } from "@/components/ui/custom/main-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthCredentials } from "@/types/auth/authTypes";
import { DashboardManager } from "@/api/services/DashboardService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { use } from "react";
import { useUserStore } from "@/store/userStore";

// Define form schema using zod
const formSchema = z.object({
  username: z
    .string()
    .optional()
    .refine((value) => !value || z.string().safeParse(value).success, {
      message: "Invalid username",
    }),
  password: z
    .string()
    .optional() // Make the password field optional
    .refine((value) => !value || value.length >= 8, {
      message: "Password must be at least 8 characters long",
    }),
});

type AuthFormValues = z.infer<typeof formSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  // Define the mutation for user authentication
  const authMutation = useMutation({
    mutationFn: async (data: AuthCredentials) => {
      return await DashboardManager.userAuth(data);
    },
    onSuccess: (response) => {
      console.log("Auth Response:", response);
      navigate("/");
    }
  });

  const onSubmit: SubmitHandler<AuthFormValues> = (data) => {
    authMutation.mutate(data as AuthCredentials); // Ensure type compatibility
  };

  return (
    <div className="flex items-center justify-center p-4 h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-28 h-28">
              <AvatarImage src="/mainLogo.png" alt="home" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className={`flex-rounded-border`}>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="username"
                          className="border-none shadow-none relative flex-1 rounded-full px-3 flex items-center justify-center text-center"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-muted-foreground" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className={`flex-rounded-border`}>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          className="border-none shadow-none relative flex-1 rounded-full px-3 flex items-center justify-center text-center"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-muted-foreground" />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Submit Button */}
              <div className={`flex-rounded-border`}>
                <MainButton
                  isLoading={false} // Replace with actual loading state if needed
                  loadingText={"Signing In..."}
                  defaultText={"Sign In"}
                  type="submit"
                  className="w-full h-12 text-base bg-black hover:bg-black/90"
                  isDisabled={!form.formState.isValid}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
