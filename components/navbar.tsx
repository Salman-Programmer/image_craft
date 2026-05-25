"use client";

import { UserButton, SignInButton, Show } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b  bg-gray-900 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        <div className="text-xl font-bold tracking-tight text-white">
          Image<span className="text-blue-600">Craft</span>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700">
                Sign In
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "size-10"
                }
              }} 
            />
          </Show>
        </div>
      </div>
    </nav>
  );
}