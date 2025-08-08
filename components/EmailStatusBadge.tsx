"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  MailCheck,
  MailX,
  RefreshCw,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { InterestedContractor } from "@/app/lib/types/interestedContractors";

interface EmailStatusBadgeProps {
  contractor: InterestedContractor;
  onRetry?: (contractorId: string) => void;
  isRetrying?: boolean;
  showRetryButton?: boolean;
}

export const EmailStatusBadge: React.FC<EmailStatusBadgeProps> = ({
  contractor,
  onRetry,
  isRetrying = false,
  showRetryButton = true,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  // Email sent successfully
  if (contractor.welcomeEmailSent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-help"
            >
              <MailCheck className="w-3 h-3 mr-1" />
              Sent
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-medium">Email sent successfully</p>
              {contractor.welcomeEmailSentAt && (
                <p className="text-muted-foreground">
                  {formatRelativeTime(contractor.welcomeEmailSentAt)}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Email failed
  if (contractor.welcomeEmailError) {
    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 cursor-help"
              >
                <MailX className="w-3 h-3 mr-1" />
                Failed
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="text-sm">
                <p className="font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Email delivery failed
                </p>
                <p className="text-muted-foreground mt-1 break-words">
                  {contractor.welcomeEmailError}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Click retry button to attempt sending again
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {showRetryButton && onRetry && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRetry(contractor.id)}
                  disabled={isRetrying}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {isRetrying ? 'Retrying...' : 'Retry sending email'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  // Email not sent yet
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 cursor-help"
          >
            <Mail className="w-3 h-3 mr-1" />
            Not Sent
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Welcome email pending
            </p>
            <p className="text-muted-foreground">
              Will be sent with next bulk email action
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};