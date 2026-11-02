"use client";

import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";

export default function SocialLogin({ redirectTo = "/" }) {
  const handleGoogle = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirectTo });
    if (error) toast.error(error.message || "Google sign-in failed");
  };

  return (
    <button type="button" onClick={handleGoogle} className="btn btn-outline w-full rounded-full">
      <FaGoogle /> Continue with Google
    </button>
  );
}
