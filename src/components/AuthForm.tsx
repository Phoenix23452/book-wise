"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ZodType } from "zod";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./ImageUpload";

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  shema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data?: T) => Promise<{ success: boolean; error?: string }>;
}

export default function AuthForm<T extends FieldValues>({
  type,
  shema,
  defaultValues,
  onSubmit,
}: Props<T>) {
  const isSignIn = type === "SIGN_IN";
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(shema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handelSubmit: SubmitHandler<T> = async (data) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data);
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>

      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of recources and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to library "}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handelSubmit)}
          className="space-y-6 w-full"
        >
          {defaultValues &&
            Object.keys(defaultValues).map((field) => (
              <FormField
                control={form.control}
                name={field as Path<T>}
                key={field}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    </FormLabel>
                    <FormControl>
                      {field.name === "universityCard" ? (
                        <ImageUpload onFileChange={field.onChange} />
                      ) : (
                        <Input
                          className="form-input"
                          required
                          type={
                            FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                          }
                          {...field}
                        />
                      )}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

          <Button className="form-btn" type="submit">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise ? " : "Already have an account ? "}

        <Link
          className="font-bold text-primary"
          href={isSignIn ? "/signup" : "login"}
        >
          {isSignIn ? "Create accout" : "Sign In"}
        </Link>
      </p>
    </div>
  );
}
