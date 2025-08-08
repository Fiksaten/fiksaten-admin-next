"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MailCheck,
  MailX,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { EmailSendingResult } from "@/app/lib/types/interestedContractors";

interface EmailSendingProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  result: EmailSendingResult | null;
  error: string | null;
}

export const EmailSendingProgressDialog: React.FC<EmailSendingProgressDialogProps> = ({
  open,
  onOpenChange,
  isLoading,
  result,
  error,
}) => {
  const [progress, setProgress] = useState(0);

  // Simulate progress when loading
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    } else if (result || error) {
      setProgress(100);
    }
  }, [isLoading, result, error]);

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sending Welcome Emails
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Section */}
          {isLoading && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 animate-pulse" />
                Processing email queue...
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                This may take a few moments depending on the number of emails to send
              </p>
            </div>
          )}

          {/* Error Section */}
          {error && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Email sending failed</span>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Success Section */}
          {result && !isLoading && !error && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Email sending completed</span>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <MailCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Successfully Sent</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-1">{result.sent}</p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <MailX className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Failed</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-1">{result.failed}</p>
                </div>
              </div>

              {/* Error Details */}
              {result.errors && result.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Failed Email Details
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {result.errors.map((error, index) => (
                      <div
                        key={index}
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-mono text-amber-800 dark:text-amber-200">
                            {error.email}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Failed
                          </Badge>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 break-words">
                          {error.error}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {result.sent > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {result.sent === 1 
                      ? "1 welcome email has been sent successfully."
                      : `${result.sent} welcome emails have been sent successfully.`
                    }
                    {result.failed > 0 && (
                      <span className="block mt-1">
                        You can retry failed emails individually from the table.
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : "Close"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};