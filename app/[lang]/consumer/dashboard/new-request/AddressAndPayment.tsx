import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
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

export default function AddressAndPayment({
  dict,
  formData,
  handleInputChange,
}: {
  dict: Dictionary;
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeadBox
        dict={dict}
        title="Address and Payment"
        description="Please provide the address and payment method for the order."
        imageName="woman-phone-lander"
      />
      <div>
        <Label htmlFor="orderStreet">Street</Label>
        <Input
          id="orderStreet"
          name="orderStreet"
          value={formData.orderStreet}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="orderCity">City</Label>
        <Input
          id="orderCity"
          name="orderCity"
          value={formData.orderCity}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="orderZip">ZIP Code</Label>
        <Input
          id="orderZip"
          name="orderZip"
          value={formData.orderZip}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="locationMoreInfo">Additional Location Info</Label>
        <Textarea
          id="locationMoreInfo"
          name="locationMoreInfo"
          value={formData.locationMoreInfo}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label>Payment Method</Label>
        <RadioGroup
          name="paymentMethod"
          value={formData.paymentMethod}
          onValueChange={(value) =>
            handleInputChange({
              target: { name: "paymentMethod", value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="later" id="later" />
            <Label htmlFor="later">Later</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="now" id="now" />
            <Label htmlFor="now">Now</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
