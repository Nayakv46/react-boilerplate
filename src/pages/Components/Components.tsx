import ComponentListElementWrapper from "./ComponentListElementWrapper";
import AlertDialogWrapper from "@/components/ui/shadcn/AlertDialogWrapper";
import PopoverWrapper from "@/components/ui/shadcn/PopoverWrapper";
import { LuSettings } from "react-icons/lu";
import Loader from "@/components/Loader/Loader";
import TooltipWrapper from "@/components/ui/shadcn/TooltipWrapper";
import { BsExclamationCircle } from "react-icons/bs";
import Toasts from "./Toasts";

const Components = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h4>Components</h4>
      <div className="grid grid-cols-4 gap-4">
        <ComponentListElementWrapper title="Alert Dialog">
          <AlertDialogWrapper
            title="Delete entry?"
            description="This action cannot be undone. The entry will be permanently removed."
            confirmText="Delete"
            cancelText="Cancel"
            // onClick={handleDelete}
            triggerButtonProps={{
              variant: "destructive",
              type: "button",
              text: "Delete",
              disabled: false,
            }}
          />
        </ComponentListElementWrapper>
        <ComponentListElementWrapper title="Popover">
          <PopoverWrapper
            trigger={
              <button
                type="button"
                className="p-2.5 w-max bg-popover rounded-full text-text-gray hover:text-foreground transition cursor-pointer"
              >
                <LuSettings className="w-4 h-4" />
              </button>
            }
            description={
              <div className="flex flex-col ">
                <button
                  type="button"
                  className="flex gap-2 justify-between text-start rounded-none px-3 py-1 text-sm text-foreground transition hover:bg-accent"
                >
                  Button 1
                </button>
                <button
                  type="button"
                  className="flex gap-2 justify-between text-start rounded-none px-3 py-1 text-sm text-foreground transition hover:bg-accent"
                >
                  Button 2
                </button>
              </div>
            }
            className="w-max p-0 min-w-40 overflow-hidden"
            align="start"
          />
        </ComponentListElementWrapper>
        <ComponentListElementWrapper title="Loader">
          <Loader />
        </ComponentListElementWrapper>
        <ComponentListElementWrapper title="Tooltip">
          <TooltipWrapper
            triggerText={<BsExclamationCircle fill="var(--destructive)" />}
            content={"Warning: This is a tooltip example."}
            triggerClassName="w-max"
          />
        </ComponentListElementWrapper>
      </div>

      <Toasts />
    </div>
  );
};

export default Components;
