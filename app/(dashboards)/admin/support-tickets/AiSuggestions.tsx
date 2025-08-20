"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Lightbulb, MessageSquare, Info, ArrowRight, RefreshCw, Sparkles, Zap, Target, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  getTicketAiSuggestions, 
  acceptTicketAiSuggestion, 
  dismissTicketAiSuggestion 
} from "@/app/lib/openapi-client/sdk.gen";

interface AiSuggestionsProps {
  ticketId: string;
  accessToken: string;
  onSuggestionAccepted?: (suggestion: AiSuggestion) => void;
  onCategorySuggestion?: (category: string) => void;
  onPrioritySuggestion?: (priority: string) => void;
  onResponseSuggestion?: (response: string) => void;
}

interface AiSuggestion {
  id: string;
  analysisId: string;
  ticketId: string;
  type: string;
  title: string | null;
  contentMarkdown: string | null;
  confidence: number | null;
  sources?: unknown;
  createdAt: string;
  createdBy: string;
  status: string;
  acceptedBy: string | null;
  acceptedAt: string | null;
  dismissedBy: string | null;
  dismissedAt: string | null;
}

const getSuggestionIcon = (type: string) => {
  switch (type) {
    case "SUGGESTED_ANSWER":
      return <MessageSquare className="h-4 w-4" />;
    case "RELATED_INFO":
      return <Info className="h-4 w-4" />;
    case "NEXT_STEPS":
      return <ArrowRight className="h-4 w-4" />;
    case "ROUTING_SUGGESTION":
      return <ArrowRight className="h-4 w-4" />;
    case "CATEGORY":
      return <Target className="h-4 w-4" />;
    case "PRIORITY":
      return <Zap className="h-4 w-4" />;
    case "SUMMARY":
      return <Lightbulb className="h-4 w-4" />;
    case "ACTIONS":
      return <Clock className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getSuggestionColor = (type: string) => {
  switch (type) {
    case "SUGGESTED_ANSWER":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "RELATED_INFO":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "NEXT_STEPS":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    case "ROUTING_SUGGESTION":
      return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
    case "CATEGORY":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800";
    case "PRIORITY":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    case "SUMMARY":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
    case "ACTIONS":
      return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

const getSuggestionTypeLabel = (type: string) => {
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const getSuggestionActionButton = (type: string, content: string | null) => {
  if (!content) return null;
  
  switch (type) {
    case "CATEGORY":
      return (
        <Button size="sm" variant="outline" className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700">
          <Target className="h-3 w-3 mr-1" />
          Apply Category
        </Button>
      );
    case "PRIORITY":
      return (
        <Button size="sm" variant="outline" className="h-8 px-3 bg-red-50 hover:bg-red-100 border-red-200 text-red-700">
          <Zap className="h-3 w-3 mr-1" />
          Apply Priority
        </Button>
      );
    case "SUGGESTED_ANSWER":
      return (
        <Button size="sm" variant="outline" className="h-8 px-3 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
          <MessageSquare className="h-3 w-3 mr-1" />
          Use as Reply
        </Button>
      );
    default:
      return null;
  }
};

export default function AiSuggestions({ 
  ticketId, 
  accessToken, 
  onSuggestionAccepted,
  onCategorySuggestion,
  onPrioritySuggestion,
  onResponseSuggestion
}: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTicketAiSuggestions({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        path: { id: ticketId }
      });

      if (response.error) {
        throw new Error(`Failed to fetch AI suggestions: ${response.error}`);
      }

      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Failed to load AI suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to load AI suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [ticketId, accessToken]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadSuggestions();
      toast({
        title: "Refreshed",
        description: "AI suggestions refreshed",
      });
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAccept = async (suggestion: AiSuggestion) => {
    try {
      setProcessing(suggestion.id);
      const response = await acceptTicketAiSuggestion({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        path: { id: ticketId, suggestionId: suggestion.id }
      });

      if (response.error) {
        throw new Error(`Failed to accept AI suggestion: ${response.error}`);
      }
      
      setSuggestions(prev => 
        prev.map(s => 
          s.id === suggestion.id 
            ? { ...s, status: "accepted", acceptedAt: new Date().toISOString() }
            : s
        )
      );
      
      if (onSuggestionAccepted) {
        onSuggestionAccepted(suggestion);
      }
      

      if (suggestion.type === "CATEGORY" && suggestion.contentMarkdown && onCategorySuggestion) {
        onCategorySuggestion(suggestion.contentMarkdown);
      } else if (suggestion.type === "PRIORITY" && suggestion.contentMarkdown && onPrioritySuggestion) {
        onPrioritySuggestion(suggestion.contentMarkdown);
      } else if (suggestion.type === "SUGGESTED_ANSWER" && suggestion.contentMarkdown && onResponseSuggestion) {
        onResponseSuggestion(suggestion.contentMarkdown);
      }
      
      toast({
        title: "Suggestion accepted",
        description: "AI suggestion has been accepted and applied",
      });
    } catch (error) {
      console.error("Failed to accept suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to accept suggestion",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleDismiss = async (suggestion: AiSuggestion) => {
    try {
      setProcessing(suggestion.id);
      const response = await dismissTicketAiSuggestion({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        path: { id: ticketId, suggestionId: suggestion.id }
      });

      if (response.error) {
        throw new Error(`Failed to dismiss AI suggestion: ${response.error}`);
      }
      
      setSuggestions(prev => 
        prev.map(s => 
          s.id === suggestion.id 
            ? { ...s, status: "dismissed", dismissedAt: new Date().toISOString() }
            : s
        )
      );
      
      toast({
        title: "Suggestion dismissed",
        description: "AI suggestion has been dismissed",
      });
    } catch (error) {
      console.error("Failed to dismiss suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to dismiss suggestion",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleQuickAction = (suggestion: AiSuggestion) => {
    if (suggestion.type === "CATEGORY" && suggestion.contentMarkdown && onCategorySuggestion) {
      onCategorySuggestion(suggestion.contentMarkdown);
      toast({
        title: "Category Applied",
        description: `Category updated to: ${suggestion.contentMarkdown}`,
      });
    } else if (suggestion.type === "PRIORITY" && suggestion.contentMarkdown && onPrioritySuggestion) {
      onPrioritySuggestion(suggestion.contentMarkdown);
      toast({
        title: "Priority Applied",
        description: `Priority updated to: ${suggestion.contentMarkdown}`,
      });
    } else if (suggestion.type === "SUGGESTED_ANSWER" && suggestion.contentMarkdown && onResponseSuggestion) {
      onResponseSuggestion(suggestion.contentMarkdown);
      toast({
        title: "Response Applied",
        description: "AI response has been added to your reply field",
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading AI suggestions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No AI suggestions available for this ticket</p>
            <p className="text-sm">AI analysis may still be in progress</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-2"
            >
              {refreshing ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeSuggestions = suggestions.filter(s => s.status === "proposed");
  const acceptedSuggestions = suggestions.filter(s => s.status === "accepted");
  const dismissedSuggestions = suggestions.filter(s => s.status === "dismissed");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Suggestions ({suggestions.length})
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-auto"
          >
            {refreshing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Suggestions */}
        {activeSuggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <h4 className="font-medium text-sm text-muted-foreground">Active Suggestions</h4>
              <Badge variant="secondary" className="text-xs">
                {activeSuggestions.length} new
              </Badge>
            </div>
            <div className="space-y-3">
              {activeSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-4 rounded-lg border-2 ${getSuggestionColor(suggestion.type)} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getSuggestionIcon(suggestion.type)}
                      <Badge variant="outline" className="text-xs font-medium">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </Badge>
                      {suggestion.confidence && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {/* Quick Action Button */}
                      {getSuggestionActionButton(suggestion.type, suggestion.contentMarkdown) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction(suggestion)}
                          disabled={processing === suggestion.id}
                          className="h-8 px-3"
                        >
                          {getSuggestionActionButton(suggestion.type, suggestion.contentMarkdown)}
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismiss(suggestion)}
                        disabled={processing === suggestion.id}
                        className="h-8 px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                      >
                        {processing === suggestion.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(suggestion)}
                        disabled={processing === suggestion.id}
                        className="h-8 px-3 bg-green-600 hover:bg-green-700"
                      >
                        {processing === suggestion.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {suggestion.title && (
                    <h5 className="font-semibold mb-2 text-lg">{suggestion.title}</h5>
                  )}
                  
                  {suggestion.contentMarkdown && (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{suggestion.contentMarkdown}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-current border-opacity-20">
                    Generated by {suggestion.createdBy || 'AI Assistant'} on {new Date(suggestion.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Suggestions */}
        {acceptedSuggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-sm text-muted-foreground">Accepted Suggestions</h4>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                {acceptedSuggestions.length} accepted
              </Badge>
            </div>
            <div className="space-y-3">
              {acceptedSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 rounded-lg border-2 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                      ACCEPTED
                    </Badge>
                    {suggestion.type && (
                      <Badge variant="outline" className="text-xs">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </Badge>
                    )}
                  </div>
                  
                  {suggestion.title && (
                    <h5 className="font-semibold mb-2 text-lg">{suggestion.title}</h5>
                  )}
                  
                  {suggestion.contentMarkdown && (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{suggestion.contentMarkdown}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-green-200">
                    Accepted on {new Date(suggestion.acceptedAt!).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dismissed Suggestions */}
        {dismissedSuggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-gray-600" />
              <h4 className="font-medium text-sm text-muted-foreground">Dismissed Suggestions</h4>
              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                {dismissedSuggestions.length} dismissed
              </Badge>
            </div>
            <div className="space-y-3">
              {dismissedSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 rounded-lg border-2 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800 opacity-75"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <X className="h-4 w-4 text-gray-600" />
                    <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                      DISMISSED
                    </Badge>
                    {suggestion.type && (
                      <Badge variant="outline" className="text-xs">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </Badge>
                    )}
                  </div>
                  
                  {suggestion.title && (
                    <h5 className="font-semibold mb-2 text-lg">{suggestion.title}</h5>
                  )}
                  
                  {suggestion.contentMarkdown && (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{suggestion.contentMarkdown}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-gray-200">
                    Dismissed on {new Date(suggestion.dismissedAt!).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
