
"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/redeem");
            }
        }
    }, [user, loading, router]);

    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
}
