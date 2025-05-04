import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session) redirect("/");

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex gap-3">
            <Image src={"/icons/logo.svg"} alt="logo" width={37} height={37} />

            <h1 className="text-2xl font-semibold text-white">BookWise</h1>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          className="size-full object-cover"
          src={"/images/auth-illustration.png"}
          alt="auth illustration"
          width={1000}
          height={1000}
        />
      </section>
    </main>
  );
}
