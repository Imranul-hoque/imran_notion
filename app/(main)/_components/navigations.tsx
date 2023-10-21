"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-items";
import { Item } from "./item";
import { useMutation } from 'convex/react';
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TrashBox from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import {Navbar} from "./navbar";

const Navigations = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const pathname = usePathname();
  const isResizingRef = useRef(false);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const [isCollapse, setIsCollapse] = useState(false);
  const [isResetting, setIsResetting] = useState(isMobile);
  const router = useRouter();
  const create = useMutation(api.documents.create)
  const searchModal = useSearch((state) => state.onOpen);
  const settingsModal = useSettings((state) => state.onOpen)
  const params = useParams();

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapse(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapse(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };
  
  const handleCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar w-60 h-full overflow-y-auto bg-secondary flex flex-col relative z-[99999]",
          isResetting && "transition duration-300 ease-in-out",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          className={cn(
            "text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm absolute top-2 right-3 cursor-pointer opacity-0 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-5 w-5" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={searchModal} />
          <Item label="Settings" icon={Settings} onClick={settingsModal} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-3">
          <DocumentList />
          <Item onClick={handleCreate} icon={Plus} label="Add a page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="w-1 h-full absolute bg-primary/10 transition-all top-0 right-0 cursor-ew-resize opacity-0 group-hover/sidebar:opacity-100"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapse} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapse && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Navigations;
