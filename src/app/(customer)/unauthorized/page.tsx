import React from "react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-140px)]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] text-center">
        <h1 className="text-4xl font-bold tracking-tight font-outfit text-destructive">Unauthorized</h1>
        <p className="text-lg text-muted-foreground">
          You do not have the required permissions to access the staff dashboard.
        </p>
        <div className="mt-4">
          <Link 
            href="/" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Return to Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
