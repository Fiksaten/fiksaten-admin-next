"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, X } from "lucide-react";

export interface AISuggestion {
  id: string;
  answer: string;
  confidence: number;
  sources: Array<{ title: string; url: string }>;
  relatedInformation: Array<{ id: string; title: string; content: string }>;
  createdAt: string;
}

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  loading?: boolean;
  pending?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCopy: (text: string) => void;
  onAccept: (suggestion: AISuggestion) => void;
  onDismiss?: (id: string) => void;
}

export function AISuggestionsPanel({
  suggestions,
  loading = false,
  pending = false,
  error = null,
  onRetry,
  onCopy,
  onAccept,
  onDismiss,
}: AISuggestionsPanelProps) {
  const [items, setItems] = useState<AISuggestion[]>([]);

  useEffect(() => {
    setItems(suggestions);
  }, [suggestions]);

  const handleCopy = (answer: string) => {
    onCopy(answer);
  };

  const handleAccept = (s: AISuggestion) => {
    onAccept(s);
    setItems((prev) => prev.filter((i) => i.id !== s.id));
  };

  const handleDismiss = (id: string) => {
    onDismiss?.(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Suggestions</CardTitle>
        <Badge variant="outline">AI via Agentuity</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {pending && (
          <Alert>
            <AlertDescription>
              Analysis in progress...
              {onRetry && (
                <Button variant="link" size="sm" className="ml-2 p-0" onClick={onRetry}>
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert>
            <AlertDescription>
              {error}
              {onRetry && (
                <Button variant="link" size="sm" className="ml-2 p-0" onClick={onRetry}>
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
        {loading && !pending && !error && <p>Loading suggestions...</p>}
        {!loading && items.length === 0 && !pending && !error && (
          <p className="text-sm text-muted-foreground">No suggestions available.</p>
        )}
        {items.map((s) => (
          <div key={s.id} className="space-y-2 border rounded p-4">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{s.answer}</ReactMarkdown>
            </div>
            <div className="text-sm text-muted-foreground">
              Confidence: {(s.confidence * 100).toFixed(0)}%
            </div>
            {s.sources.length > 0 && (
              <div className="text-sm">
                <p className="font-medium">Sources</p>
                <ul className="list-disc ml-4">
                  {s.sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" className="underline">
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.relatedInformation.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Related Information</p>
                {s.relatedInformation.map((info) => (
                  <details key={info.id} className="border rounded">
                    <summary className="cursor-pointer px-2 py-1 text-sm">
                      {info.title}
                    </summary>
                    <div className="px-2 py-1 text-sm whitespace-pre-wrap">
                      {info.content}
                    </div>
                  </details>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-muted-foreground">
                {new Date(s.createdAt).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(s.answer)}
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy to reply
                </Button>
                <Button size="sm" onClick={() => handleAccept(s)}>
                  <Check className="h-4 w-4 mr-1" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDismiss(s.id)}
                >
                  <X className="h-4 w-4 mr-1" /> Dismiss
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default AISuggestionsPanel;
