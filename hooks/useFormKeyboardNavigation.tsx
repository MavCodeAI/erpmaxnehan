// FIX: Import `React` to make the `React` namespace available for types like `React.KeyboardEvent`.
import React, { RefObject } from 'react';

export const useFormKeyboardNavigation = (formRef: RefObject<HTMLFormElement | null>) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Don't interfere with textareas or submit buttons
        if (e.key === 'Enter' && !(e.target as HTMLElement).matches('textarea, button[type="submit"]')) {
            e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            // Find all focusable elements
            const focusable = Array.from(
                form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            // FIX: Explicitly type `el` as `Element` to fix an issue where it was being inferred as `unknown`.
            ).filter((el: Element) => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
            });
            
            const index = focusable.indexOf(document.activeElement as HTMLElement);
            
            // Focus the next element if it exists
            if (index > -1 && index < focusable.length - 1) {
                const nextElement = focusable[index + 1] as HTMLElement;
                nextElement.focus();
            }
        }
    };
    return { handleKeyDown };
};
