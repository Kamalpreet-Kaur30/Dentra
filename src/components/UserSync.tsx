"use client";

import { syncUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; 

function UserSync() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter(); 
  const pathname = usePathname(); 
useEffect(() => {
    const handleUserSyncAndRedirect = async () => {
      if (isLoaded && isSignedIn) {
        try {
          await syncUser();
          if (pathname === "/" || pathname === "/login") { 
              router.push("/dashboard"); 
          }
          
        } catch (error) {
          console.error("Failed to sync user", error);
        }
      } 
    };
handleUserSyncAndRedirect();
  }, [isLoaded, isSignedIn, router, pathname]);

  return null;
}
export default UserSync;
