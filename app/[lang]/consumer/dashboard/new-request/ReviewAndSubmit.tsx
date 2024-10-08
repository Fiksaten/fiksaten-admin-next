import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dictionary } from "@/lib/dictionaries";
import HeadBox from "./HeadBox";
import Image from "next/image";
import { useState, useEffect } from "react";
import { OrderFormData } from "./new-request-form";

export default function ReviewAndSubmit({
  dict,
  formData,
}: {
  dict: Dictionary;
  formData: OrderFormData;
}) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const previews = formData.images
      ? Array.from(formData.images).map((file) => URL.createObjectURL(file))
      : [];
    setImagePreviews(previews);
    return () => previews.forEach(URL.revokeObjectURL);
  }, [formData.images]);

  const addedImages = formData.images ? formData.images.length : 0;
  const fetchedImages = formData.fetchedImages
    ? formData.fetchedImages.length
    : 0;
  const totalImages = addedImages + fetchedImages;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeadBox
        dict={dict}
        title="Yhteenveto"
        description="Tarkista antamasi tiedot ennen tilauksen lähettämistä."
        imageName="woman-phone-lander"
      />

      <h2 className="text-2xl font-bold">Tilauksen yhteenveto</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Otsikko:</h3>
          <p>{formData.title}</p>
        </div>
        <div>
          <h3 className="font-semibold">Kuvaus:</h3>
          <p>{formData.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Budjetti:</h3>
          <p>{formData.budget} €</p>
        </div>
        <div>
          <h3 className="font-semibold">Aikataulu:</h3>
          <p>{formData.scheduleOption}</p>
        </div>
        <div>
          <h3 className="font-semibold">Aloituspäivä:</h3>
          <p>
            {formData.startDate
              ? format(formData.startDate, "dd.MM.yyyy")
              : "Ei määritelty"}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Lopetuspäivä:</h3>
          <p>
            {formData.endDate
              ? format(formData.endDate, "dd.MM.yyyy")
              : "Ei määritelty"}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Osoite:</h3>
          <p>
            {formData.orderStreet}, {formData.orderZip} {formData.orderCity}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Lisätiedot sijainnista:</h3>
          <p>{formData.locationMoreInfo || "Ei lisätietoja"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Maksutapa:</h3>
          <p>{formData.paymentMethod === "later" ? "Myöhemmin" : "Nyt"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Liitetyt kuvat:</h3>
          <p>{totalImages} kuvaa</p>
          {imagePreviews.map((preview, index) => (
            <div key={index}>
              <Image
                src={preview}
                alt={`Kuva ${index}`}
                width={100}
                height={100}
              />
            </div>
          ))}
          {formData.fetchedImages &&
            formData.fetchedImages.map((image, index) => (
              <div key={index}>
                <Image
                  src={image}
                  alt={`Kuva ${index}`}
                  width={100}
                  height={100}
                />
              </div>
            ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-green-500 text-white font-bold mt-4"
      >
        Lähetä tilaus
      </Button>
      <p className="text-sm text-gray-500">ID: {formData?.orderId}</p>
    </div>
  );
}
