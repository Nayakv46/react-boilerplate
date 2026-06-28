import {
  Popover,
  PopoverContent,
  // PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

const PopoverWrapper = ({
  trigger,
  title,
  description,
  className,
}: {
  trigger: React.ReactNode | string;
  title?: React.ReactNode | string;
  description: React.ReactNode | string;
  className?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" asChild className={className ?? ""}>
        <PopoverHeader>
          {title ? <PopoverTitle>{title}</PopoverTitle> : null}
          {description}
          {/* <PopoverDescription>

</PopoverDescription> */}
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverWrapper;
