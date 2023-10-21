"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { FC } from "react";
import Navigations from "./_components/navigations";
import { SearchCommand } from "@/components/search-command";

interface MainLayoutProps {
    children : React.ReactNode
}
const MainLayout: FC<MainLayoutProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    
    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Spinner size={"lg"} />
            </div>
        )
    }

    if (!isAuthenticated) {
      return redirect("/");
    }

    return <div className="h-full flex dark:bg-[#1F1F1F]">
        <Navigations />
        <main className="flex-1 overflow-y-auto">
            <SearchCommand />
            {children}
        </main>
    </div>;
    
}
export default MainLayout