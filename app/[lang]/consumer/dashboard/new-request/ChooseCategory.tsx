import { Category } from "@/app/lib/types";
import Image from "next/image";
import HeadBox from "./HeadBox";
import { Dictionary } from "@/lib/dictionaries";

interface ChooseCategoryProps {
  categories: Category[];
  handleCategoryClick: (categoryId: string) => void;
  dict: Dictionary;
  setStep: (step: number) => void;
  step: number;
}

const ChooseCategory: React.FC<ChooseCategoryProps> = ({
  categories,
  handleCategoryClick,
  dict,
  setStep,
  step,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeadBox
        dict={dict}
        title="Valitse kategoria palvelulle"
        description="Valitse kategoria, joka parhaiten kuvaa tarvettasi."
        imageName="woman-phone-lander"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="aspect-square">
            <div
              className="border hover:border-blue-500 hover:bg-gray-200 rounded-md w-full h-full flex flex-col items-center p-4"
              onClick={() => {
                handleCategoryClick(category.id);
                setStep(step + 1);
              }}
            >
              <div className="relative w-full h-3/5">
                <Image
                  src={category.categoryImageUrl}
                  alt={category.categoryName}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="text-base sm:text-lg text-black font-semibold text-center mt-2">
                {category.categoryName}
              </h3>
              <p className="py-4 text-gray-500 text-center">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseCategory;
