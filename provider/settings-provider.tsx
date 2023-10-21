"use client";
import { SettingsModal } from '@/components/modals/settings-modal';
import { useState, useEffect } from 'react';
import { CoverImageModal  } from '@/components/modals/cover-image-modal';

const SettingsProvider = () => {

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        return null
    }

    return <>
        <SettingsModal />
        <CoverImageModal />
    </>;
}
 
export default SettingsProvider;