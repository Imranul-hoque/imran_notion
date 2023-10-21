"use client"

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DocumentPage = () => {
  const router = useRouter();
  const create = useMutation(api.documents.create)
  const onCreate = () => {
    const promise = create({ title: "untitle" })
      .then((documentId) => router.push(`/documents/${documentId}`))
    toast.promise(promise, {
      loading: "create a new note...",
      error: "Failed to create new node",
      success : "new note created!"
    })
  }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          src={"/empty.png"}
          alt="empty image"
          width={300}
          height={300}
          className="dark:hidden"
        />
        <Image
          src={"/empty-dark.png"}
          alt="empty dark image"
          width={300}
          height={300}
          className="hidden dark:block"
        />
        <div className="pt-3">
          <Button
            onClick={onCreate}
            className="dark:bg-black dark:text-white flex items-center gap-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            create document
          </Button>
        </div>
      </div>
    );
}

export default DocumentPage;