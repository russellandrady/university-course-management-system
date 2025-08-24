import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MainButtonProps extends ButtonProps {
  isLoading?: boolean; // Boolean to indicate loading state
  loadingText?: string; // Text to display while loading
  defaultText?: string; // Text to display when not loading
  icon?: React.ReactNode; // Optional icon to display
  onClickButton?: () => void; // Function to call on button click
  isDisabled?: boolean; // Boolean to disable the button
  iconLoading?: React.ReactNode; // Optional icon to display while loading
}

export function MainButton({
  className,
  variant = "ghost",
  size = "sm",
  isLoading = false,
  loadingText = "Processing...",
  defaultText = "Click Me",
  isDisabled = false,
  iconLoading,
  onClickButton,
  icon,
  ...props
}: MainButtonProps) {
  return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={cn(
                "border-none shadow-none relative flex-1 rounded-full px-3 flex items-center justify-center",
                isLoading && "cursor-not-allowed"
              )}
              disabled={isDisabled}
              onClick={onClickButton}
              {...props}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center gap-2"
                  >
                    {iconLoading && <span>{iconLoading}</span>}
                    <span>{loadingText}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center gap-2"
                  >
                    {icon && <span>{icon}</span>}
                    <span>{defaultText}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
  );
}