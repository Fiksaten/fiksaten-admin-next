import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dictionary } from "@/lib/dictionaries";
import { ScheduleOption } from "./Details";
import HeadBox from "./HeadBox";

interface FormData {
  categoryId: string;
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  scheduleOption: ScheduleOption;
  budget: string;
  orderStreet: string;
  orderCity: string;
  orderZip: string;
  locationMoreInfo: string;
  paymentMethod: "later" | "now";
}

export default function BudgetAndImages({
  dict,
  formData,
  handleInputChange,
  handleFileChange,
}: {
  dict: Dictionary;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeadBox
        dict={dict}
        title="Budget and Images"
        description="Please provide the budget and images for the order."
        imageName="woman-phone-lander"
      />
      <div>
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          name="budget"
          type="number"
          min="0"
          step="0.01"
          value={formData.budget}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="images">Images</Label>
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
