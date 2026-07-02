import { FormTextInput } from "@/components/ui/form/FormTextInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormTextArea from "@/components/ui/form/FormTextarea";
import FormSwitch from "@/components/ui/form/FormSwitch";
import FormSlider from "@/components/ui/form/FormSlider";
import ComponentListElementWrapper from "./ComponentListElementWrapper";
import { Form } from "@/components/ui/form/Form";
import { useForm } from "react-hook-form";

const FormComponents = () => {
  const form = useForm<any>({
    defaultValues: {},
    mode: "onChange",
  });
  return (
    <div className="flex flex-col gap-4">
      <h4>Form components</h4>
      <Form {...form}>
        <form className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          <ComponentListElementWrapper title="Form Text Input">
            <FormTextInput
              control={form.control}
              name="textInputExample"
              label="Input Label"
            />
          </ComponentListElementWrapper>

          <ComponentListElementWrapper title="Form Select">
            <FormSelect
              control={form.control}
              name="selectExample"
              label="Select Label"
              options={[
                { value: "value-1", label: "Value 1" },
                { value: "value-2", label: "Value 2" },
                { value: "value-3", label: "Value 3" },
              ]}
              className="w-full"
            />
          </ComponentListElementWrapper>

          <ComponentListElementWrapper title="Form Text Area">
            <FormTextArea
              control={form.control}
              name="textAreaExample"
              label="Text Area Label"
            />
          </ComponentListElementWrapper>

          <ComponentListElementWrapper title="Form Switch">
            <FormSwitch
              control={form.control}
              name="switchExample"
              label="Switch Label"
            />
          </ComponentListElementWrapper>

          <ComponentListElementWrapper title="Form Slider">
            <FormSlider
              control={form.control}
              name="sliderExample"
              label="Slider Label"
            />
          </ComponentListElementWrapper>
        </form>
      </Form>
    </div>
  );
};

export default FormComponents;
