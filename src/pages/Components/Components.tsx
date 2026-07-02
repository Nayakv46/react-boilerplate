import Toasts from "./Toasts";
import BaseComponents from "./BaseComponents";

const Components = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <BaseComponents />

      <Toasts />
    </div>
  );
};

export default Components;
