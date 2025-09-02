"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download, ImageIcon, X } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  images: Array<{
    id: string;
    orderId: string | null;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Tilauksen kuvat (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Ei kuvia saatavilla
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Tilauksen kuvat ({images.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group cursor-pointer">
                <img
                  src={image.imageUrl}
                  alt={`Order image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border transition-transform duration-200 group-hover:scale-105"
                  onClick={() => openImage(index)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImage(index);
                      }}
                    >
                      Katso
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.imageUrl, `order-image-${index + 1}.jpg`);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedImageIndex !== null} onOpenChange={closeImage}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Kuva {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / {images.length}</span>
              <Button variant="ghost" size="sm" onClick={closeImage}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedImageIndex !== null && (
            <div className="relative p-4">
              <div className="relative">
                <img
                  src={images[selectedImageIndex].imageUrl}
                  alt={`Order image ${selectedImageIndex + 1}`}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
                
                {/* Navigation buttons */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  onClick={prevImage}
                  disabled={selectedImageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={nextImage}
                  disabled={selectedImageIndex === images.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Image info */}
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Luotu: {new Date(images[selectedImageIndex].createdAt).toLocaleDateString("fi-FI")}</p>
                <p>Päivitetty: {new Date(images[selectedImageIndex].updatedAt).toLocaleDateString("fi-FI")}</p>
              </div>
              
              {/* Download button */}
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => downloadImage(
                    images[selectedImageIndex].imageUrl,
                    `order-image-${selectedImageIndex + 1}.jpg`
                  )}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Lataa kuva
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
